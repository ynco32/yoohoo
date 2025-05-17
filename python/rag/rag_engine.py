import os
import logging
from dotenv import load_dotenv
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQA

# 환경 변수 로드
load_dotenv()

# 로깅 설정
logger = logging.getLogger(__name__)

def split_documents(paragraphs, concert_info):
    """문단들을 더 작은 청크로 분할합니다."""
    logger.info("문단을 청크로 분할 중...")
    
    # RecursiveCharacterTextSplitter 설정
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=300,  # 청크 크기
        chunk_overlap=50,  # 청크 간 중복 (문맥 유지를 위해)
        separators=["\n\n", "\n", ".", ",", " ", ""]
    )
    
    all_texts = []
    all_metadatas = []
    
    # 각 문단을 처리
    for i, paragraph in enumerate(paragraphs):
        text = paragraph["text"]

        para_metadata = paragraph["metadata"]  # 그룹화된 문단에는 항상 metadata가 있음

        metadata = {
            "concert_id": concert_info["concert_id"],
            "paragraph_id": i,
            "top_y": para_metadata.get("top_y"),
            "bottom_y": para_metadata.get("bottom_y"),
            "category": para_metadata.get("category", "일반 정보")
        }

        
        # 콘서트 정보 메타데이터 추가 
        metadata["concert_name"] = concert_info["concert_name"]
        metadata["arena_name"] = concert_info["arena_name"]
        
        # 아티스트 정보는 문자열로 변환하여 추가 (검색 가능하게) 
        artists = concert_info.get("artist_name", [])
        if artists:
            metadata["artists"] = ", ".join(artists)
        
        # 티켓팅 정보 추가 
        metadata["ticketing_platform"] = concert_info.get("ticketing_platform")
        
        # 텍스트 분할
        splits = text_splitter.split_text(text)
        
        # 각 분할에 메타데이터 추가
        for j, split in enumerate(splits):
            all_texts.append(split)
            split_metadata = metadata.copy()
            split_metadata["chunk_id"] = f"{i}-{j}"
            split_metadata["text_snippet"] = split[:100]  # 검색 결과에서 확인할 수 있는 미리보기
            all_metadatas.append(split_metadata)
    
    logger.info(f"총 {len(all_texts)}개의 청크로 분할되었습니다.")
    return all_texts, all_metadatas

def create_rag_chain(vectorstore):
    """RAG 질의응답 체인을 생성합니다."""
    logger.info("RAG 체인 생성 중...")
    
    # OpenAI API 키 가져오기
    openai_api_key = os.getenv("OPENAI_API_KEY")
    if not openai_api_key:
        raise ValueError("OPENAI_API_KEY가 설정되지 않았습니다.")
    
    # LLM 설정
    llm = ChatOpenAI(
        api_key=openai_api_key,
        model_name="gpt-3.5-turbo",  # 또는 "gpt-4o"
        temperature=0
    )
    
    # 프롬프트 템플릿 설정
    prompt_template = """
당신은 콘서트 관련 정보를 제공하는 도우미인 '콘끼리봇'입니다. 
아래 제공된 콘서트 공지사항 정보를 바탕으로 사용자의 질문에 정확하게 답변해주세요.
말끝마다 '뿌우'를 붙여주세요. 예: "안녕하세요, 뿌우"
아래는 콘서트 공지사항입니다.

<콘서트_정보>
콘서트명: {concert_name}
공연장: {arena_name}
아티스트: {artists}
티켓팅 플랫폼: {ticketing_platform}
</콘서트_정보>

<콘서트_공지사항>
{context}
</콘서트_공지사항>

질문: {question}
답변:
"""
    def get_metadata_value(context, key, default):
        if context and len(context) > 0 and hasattr(context[0], 'metadata'):
            return context[0].metadata.get(key, default)
        return default
    
    PROMPT = PromptTemplate(
        template=prompt_template,
        input_variables=["context", "question"],
        partial_variables={
            "concert_name": lambda x: get_metadata_value(x, 'concert_name', '알 수 없는 콘서트'),
            "arena_name": lambda x: get_metadata_value(x, 'arena_name', '알 수 없는 공연장'),
            "artists": lambda x: get_metadata_value(x, 'artists', '알 수 없는 아티스트'),  # 아티스트 정보 유지 👈
            "ticketing_platform": lambda x: get_metadata_value(x, 'ticketing_platform', '알 수 없음')
        }
    )
    
    
    # QA 체인 생성
    chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vectorstore.as_retriever(search_kwargs={"k": 5}),
        return_source_documents=True,
        chain_type_kwargs={"prompt": PROMPT}
    )
    
    logger.info("RAG 체인 생성 완료!")
    return chain

def query_rag_system(chain, query, concert_id=None):

    """RAG 시스템에 질의합니다."""
    logger.info(f"질의 처리 중: '{query}'")
    
    # 검색 필터 설정 (특정 콘서트만 검색)
    search_kwargs = {"k": 5}
    if concert_id:
        search_kwargs["filter"] = {"concert_id": concert_id}
        # 검색 파라미터 업데이트
        retriever = chain.retriever
        retriever.search_kwargs.update(search_kwargs)
    
    try:
        # 검색 먼저 실행하여 문서 가져오기 👈
        docs = chain.retriever.get_relevant_documents(query)
        
        # 문서 구조 확인 👈
        if docs:
            logger.info(f"검색된 문서 수: {len(docs)}")
            logger.info(f"첫 번째 문서 타입: {type(docs[0])}")
            logger.info(f"첫 번째 문서 내용: {docs[0].page_content[:100]}...")
            
            # 메타데이터 구조 확인 👈
            if hasattr(docs[0], 'metadata'):
                logger.info(f"첫 번째 문서 메타데이터: {docs[0].metadata}")
                # 메타데이터 접근 테스트
                logger.info(f"concert_name 접근 테스트: {docs[0].metadata.get('concert_name', '없음')}")
            else:
                logger.info("문서에 metadata 속성이 없습니다.")
        else:
            logger.info("검색된 문서가 없습니다.")

        # 체인 실행
        result = chain({"query": query})

        answer = {
            "answer": result["result"],
            "concert_info": {
                "concert_id": concert_id,
                "concert_name": docs[0].metadata.get("concert_name") if docs and docs[0].metadata else None,
                "arena_name": docs[0].metadata.get("arena_name") if docs and docs[0].metadata else None,
            },
            "source_documents": [
                {
                    "content": doc.page_content,
                    "metadata": doc.metadata
                } for doc in result["source_documents"]
            ]
        }


    
    # 결과 가공 - 콘서트 정보 포함
    # answer = {
    #     "answer": result["result"],
    #     "concert_info": {
    #         "concert_id": concert_id,
    #         "concert_name": result["source_documents"][0].metadata.get("concert_name") if result["source_documents"] else None,
    #         "arena_name": result["source_documents"][0].metadata.get("arena_name") if result["source_documents"] else None,
    #     },
    #     "source_documents": [
    #         {
    #             "content": doc.page_content,
    #             "metadata": doc.metadata
    #         } for doc in result["source_documents"]
    #     ]
    # }
    
        logger.info("질의 처리 완료")
        return answer
    
    except Exception as e:
        logger.error(f"질의 처리 중 오류: {str(e)}")
        # 간소화된 답변 반환
        return {
            "answer": f"죄송합니다, 질문에 답변하는 과정에서 오류가 발생했습니다. 오류: {str(e)} 뿌우",
            "error": str(e)
        }
    