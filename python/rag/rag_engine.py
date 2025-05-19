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
    
# 프롬프트 템플릿 수정
    prompt_template = """
당신은 콘서트 관련 정보를 제공하는 도우미인 '콘끼리봇'입니다. 
아래 제공된 콘서트 공지사항 정보를 바탕으로 사용자의 질문에 정확하게 답변해주세요.
말끝마다 '뿌우'를 붙여주세요. 예: "안녕하세요, 뿌우"

<콘서트_정보>
{context}
</콘서트_정보>

질문: {question}

다음 지침에 따라 답변해주세요:
1. 콘서트 공지사항 정보를 기반으로 질문에 답변하세요.
2. 답변의 출처가 되는 가장 중요한 문단이나 문서를 선택하세요.
3. 출처 문서의 메타데이터에서 top_y와 bottom_y 좌표 값을 확인하세요.
4. 정확한 좌표가 없거나 연관성이 낮은 경우에만 "없음"으로 응답하세요.
5. 아래 형식으로 정확히 응답하세요:

[답변]
당신의 답변 내용을 여기에 작성하세요.

[증거_좌표]
좌표가 있을 경우: top_y=숫자값,bottom_y=숫자값
좌표가 없을 경우: 없음

좌표는 메타데이터에서 찾을 수 있으며, 정확한 좌표가 있는 경우 반드시 제공해야 합니다. 
입력 문서가 여러 개인 경우, 답변과 가장 관련성이 높은 문서의 좌표를 선택하세요.

예시 1 (정확한 좌표가 있는 경우):
[답변]
콘서트는 5월 17일 오후 6시에 시작합니다. 뿌우

[증거_좌표]
top_y=500,bottom_y=600

예시 2 (좌표가 없거나 관련성이 낮은 경우):
[답변]
죄송합니다만, 제공된 정보에서 공연 시작 시간에 대한 내용을 찾을 수 없습니다. 뿌우

[증거_좌표]
없음
"""
    PROMPT = PromptTemplate(
            template=prompt_template,
            input_variables=["context", "question"]
        )
    
        
    retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

    document_prompt = PromptTemplate(
        input_variables=["page_content", "metadata"], 
        template="""내용: {page_content}
메타데이터: top_y={metadata[top_y]}, bottom_y={metadata[bottom_y]}, 카테고리={metadata[category]}"""
    )

    chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True,
        chain_type_kwargs={
            "prompt": PROMPT,
            # "document_prompt": PromptTemplate(
            #     input_variables=["page_content"], 
            #     template="{page_content}"
            # ),
            "document_prompt": document_prompt,
            "document_variable_name": "context",
            "document_separator": "\n\n"
        }
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
        if hasattr(chain, 'retriever'):
            retriever = chain.retriever
            retriever.search_kwargs.update(search_kwargs)
    
    try:
        result = chain.invoke({"query": query})
        
        # 결과 형식 확인 및 처리
        if isinstance(result, dict) and "result" in result:
            answer_text = result.get("result", "응답을 찾을 수 없습니다.")
            logger.info(f"GPT 응답: {result['result'][:200]}...")

        elif isinstance(result, str):
            answer_text = result
        else:
            logger.warning(f"예상치 못한 결과 형식: {type(result)}")
            answer_text = str(result)

        import re
        answer_match = re.search(r'\[답변\](.*?)(?=\[증거_좌표\]|\Z)', answer_text, re.DOTALL) 
        coords_match = re.search(r'\[증거_좌표\](.*?)(?=\[|\Z)', answer_text, re.DOTALL)

        if answer_match: 
            answer = answer_match.group(1).strip() 
        else: 
            answer = answer_text
        
        # 좌표 정보 추출 수정
        evidence_coordinates = []
        if coords_match:
            coords_text = coords_match.group(1).strip()
            
            # "없음" 케이스 확인
            if "없음" in coords_text or "none" in coords_text.lower():
                # 증거 자료 없음 - 빈 리스트 유지
                logger.info("GPT가 '없음'이라고 응답했습니다")
            else:
                # 좌표 파싱 시도 (콤마로 구분된 키-값 쌍 형식)
                # 정규식 패턴 개선
                coords_pattern = r'top_y\s*=\s*(\d+)\s*,\s*bottom_y\s*=\s*(\d+)'
                coords_values = re.search(coords_pattern, coords_text)
                
                if coords_values:
                    top_y = int(coords_values.group(1))
                    bottom_y = int(coords_values.group(2))
                    logger.info(f"파싱된 좌표: top_y={top_y}, bottom_y={bottom_y}")
                    
                    evidence_coordinates.append({
                        "top_y": top_y,
                        "bottom_y": bottom_y
                    })
                else:
                    logger.warning(f"좌표 형식이 맞지 않습니다: '{coords_text}'")
        # 통일된 결과 형식
        response = {
            "answer": answer,
            "source_documents": [],
            "evidence_coordinates": evidence_coordinates 
        }
        
        # 소스 문서 추가 (있는 경우)
        if isinstance(result, dict) and "source_documents" in result:
            response["source_documents"] = [
                {
                    "content": doc.page_content,
                    "metadata": doc.metadata
                } for doc in result["source_documents"]
            ]
        #     response["evidence_coordinates"] = [
        #     {
        #         "top_y": doc.metadata["top_y"],
        #         "bottom_y": doc.metadata["bottom_y"],
        #         "category": doc.metadata.get("category", "일반 정보")
        #     } for doc in result["source_documents"] 
        #     if "top_y" in doc.metadata and "bottom_y" in doc.metadata
        # ]
        
        logger.info("질의 처리 완료")
        return response
    
    except Exception as e:
        logger.error(f"질의 처리 중 오류: {str(e)}")
        import traceback
        logger.error(traceback.format_exc()) 
        # 간소화된 답변 반환
        return {
            "answer": f"죄송합니다, 질문에 답변하는 과정에서 오류가 발생했습니다 뿌우...",
            "error": str(e),
            "source_documents": [],
            "evidence_coordinates": []
        }
