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

# def create_rag_chain(vectorstore):
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
2. 답변의 출처가 되는 가장 중요한 문서 ID를 명시하세요.
3. 아래 형식으로 정확히 응답하세요:

[답변]
당신의 답변 내용을 여기에 작성하세요.

[참조_문서]
가장 관련성 높은 문서 ID 하나만 선택 (예: #2)

예시:
[답변]
콘서트는 5월 17일 오후 6시에 시작합니다. 뿌우

[참조_문서]
#3
"""
    PROMPT = PromptTemplate(
            template=prompt_template,
            input_variables=["context", "question"]
        )
    
        
    retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

    document_prompt = PromptTemplate(
        input_variables=["page_content", "id"], 
        template="""[문서 #{id}]
{page_content}
[문서 #{id} 끝]"""
    )
    
    def format_docs_with_ids(docs):
        doc_strings = []
        for i, doc in enumerate(docs):
            # 각 문서에 ID 부여
            doc_strings.append(document_prompt.format(
                page_content=doc.page_content,
                id=i+1
            ))
        return "\n\n".join(doc_strings)

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
            "document_variable_name": "context",
            "document_separator": "\n\n",
            "document_prompt_template": "{page_content}", 
            "format_documents_function": format_docs_with_ids 
        }
    )
    
    logger.info("RAG 체인 생성 완료!")
    return chain

# 그냥 첫번째 문서 좌표 사용 ver
# def create_rag_chain(vectorstore):
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
    
    # 기본 검색기 가져오기
    retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
    
    # 프롬프트 템플릿 수정 - 문서 ID가 없는 기본 버전
    prompt_template = """
당신은 콘서트 관련 정보를 제공하는 도우미인 '콘끼리봇'입니다. 
아래 제공된 콘서트 공지사항 정보를 바탕으로 사용자의 질문에 정확하게 답변해주세요.
말끝마다 '뿌우'를 붙여주세요. 예: "안녕하세요, 뿌우"

<콘서트_정보>
{context}
</콘서트_정보>

질문: {question}

답변을 할 때는 공지사항 정보를 기반으로 정확하게 답변해주세요.
"""
    PROMPT = PromptTemplate(
            template=prompt_template,
            input_variables=["context", "question"]
        )
    
    # 기본 문서 프롬프트
    document_prompt = PromptTemplate(
        input_variables=["page_content"], 
        template="{page_content}"
    )
    
    # 기본 체인 생성
    chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True,
        chain_type_kwargs={
            "prompt": PROMPT,
            "document_prompt": document_prompt
        }
    )
    
    logger.info("RAG 체인 생성 완료!")
    return chain

# def query_rag_system(chain, query, concert_id=None):
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
        # answer_match = re.search(r'\[답변\](.*?)(?=\[증거_좌표\]|\Z)', answer_text, re.DOTALL) 
        # coords_match = re.search(r'\[증거_좌표\](.*?)(?=\[|\Z)', answer_text, re.DOTALL)

        answer_match = re.search(r'\[답변\](.*?)(?=\[참조_문서\]|\Z)', answer_text, re.DOTALL)
        doc_match = re.search(r'\[참조_문서\]\s*#?(\d+)', answer_text)

        if answer_match: 
            answer = answer_match.group(1).strip() 
        else: 
            answer = answer_text
        
        # 좌표 정보 추출 수정
        evidence_coordinates = []
        # if coords_match:
        #     coords_text = coords_match.group(1).strip()
            
        #     # "없음" 케이스 확인
        #     if "없음" in coords_text or "none" in coords_text.lower():
        #         # 증거 자료 없음 - 빈 리스트 유지
        #         logger.info("GPT가 '없음'이라고 응답했습니다")
        #     else:
        #         # 좌표 파싱 시도 (콤마로 구분된 키-값 쌍 형식)
        #         # 정규식 패턴 개선
        #         coords_pattern = r'top_y\s*=\s*(\d+)\s*,\s*bottom_y\s*=\s*(\d+)'
        #         coords_values = re.search(coords_pattern, coords_text)
                
        #         if coords_values:
        #             top_y = int(coords_values.group(1))
        #             bottom_y = int(coords_values.group(2))
        #             logger.info(f"파싱된 좌표: top_y={top_y}, bottom_y={bottom_y}")
                    
        #             evidence_coordinates.append({
        #                 "top_y": top_y,
        #                 "bottom_y": bottom_y
        #             })
        #         else:
        #             logger.warning(f"좌표 형식이 맞지 않습니다: '{coords_text}'")
        # 통일된 결과 형식

        referenced_doc_id = None
        if doc_match:
            try:
                # 참조 문서 ID 추출 (1부터 시작)
                referenced_doc_id = int(doc_match.group(1)) - 1  # 0-based 인덱스로 변환
                logger.info(f"참조된 문서 ID: #{referenced_doc_id+1}")
                
                if 0 <= referenced_doc_id < len(result["source_documents"]):
                    # 해당 문서의 메타데이터에서 좌표 추출
                    doc = result["source_documents"][referenced_doc_id]
                    if hasattr(doc, 'metadata') and 'top_y' in doc.metadata and 'bottom_y' in doc.metadata:
                        evidence_coordinates.append({
                            "top_y": doc.metadata['top_y'],
                            "bottom_y": doc.metadata['bottom_y']
                        })
                        logger.info(f"문서 #{referenced_doc_id+1}에서 좌표 추출: top_y={doc.metadata['top_y']}, bottom_y={doc.metadata['bottom_y']}")
                    else:
                        logger.warning(f"문서 #{referenced_doc_id+1}에 좌표 메타데이터가 없습니다")
                else:
                    logger.warning(f"참조된 문서 ID #{referenced_doc_id+1}가 유효하지 않습니다. 총 문서 수: {len(result['source_documents'])}")
            except (ValueError, IndexError) as e:
                logger.warning(f"참조 문서 ID 처리 오류: {str(e)}")
        else:
            logger.warning("GPT 응답에서 참조 문서 ID를 찾을 수 없습니다")
            
            # ID를 찾지 못한 경우 첫 번째 문서의 좌표 사용 (폴백) 👈
            if "source_documents" in result and len(result["source_documents"]) > 0:
                doc = result["source_documents"][0]
                if hasattr(doc, 'metadata') and 'top_y' in doc.metadata and 'bottom_y' in doc.metadata:
                    evidence_coordinates.append({
                        "top_y": doc.metadata['top_y'],
                        "bottom_y": doc.metadata['bottom_y']
                    })
                    logger.info(f"ID 없어 첫 번째 문서의 좌표 사용: top_y={doc.metadata['top_y']}, bottom_y={doc.metadata['bottom_y']}")

        response = {
            "answer": answer,
            "source_documents": [],
            "evidence_coordinates": evidence_coordinates,
            "referenced_doc_id": referenced_doc_id
        }
        
        # 소스 문서 추가 (있는 경우)
        if isinstance(result, dict) and "source_documents" in result:
            response["source_documents"] = [
                {
                    "content": doc.page_content,
                    "metadata": doc.metadata if hasattr(doc, 'metadata') else {}
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

# gpt 다시 시도 ver
def create_rag_chain(vectorstore):
    """RAG 질의응답 체인을 생성합니다."""
    logger.info("RAG 체인 생성 중...")
    
    # 단순 래퍼 객체 생성 (벡터스토어 검색기만 포함)
    class SimpleRAGChain:
        def __init__(self, retriever):
            self.retriever = retriever
            
        def __call__(self, query_dict):
            # 더미 메서드 (실제로는 query_rag_system에서 처리)
            return {"result": "This is a placeholder", "source_documents": []}
    
    # 기본 검색기 가져오기
    retriever = vectorstore.as_retriever(search_kwargs={"k": 5})
    
    # 단순 체인 생성
    chain = SimpleRAGChain(retriever)
    
    logger.info("RAG 체인 생성 완료!")
    return chain


# 그냥 첫번째 문서 좌표 사용 ver
# def query_rag_system(chain, query, concert_id=None):
#     """RAG 시스템에 질의합니다."""
#     logger.info(f"질의 처리 중: '{query}'")
    
#     # 검색 필터 설정 (특정 콘서트만 검색)
#     if concert_id and hasattr(chain, 'retriever'):
#         # 검색 필터 설정 시도
#         try:
#             chain.retriever.search_kwargs.update({"filter": {"concert_id": concert_id}})
#         except Exception as e:
#             logger.warning(f"검색 필터 설정 실패 (무시됨): {str(e)}")
    
#     try:
#         # 원본 쿼리로 체인 실행
#         result = chain.invoke({"query": query})
        
#         # 결과 형식 확인 및 처리
#         if isinstance(result, dict) and "result" in result:
#             answer_text = result.get("result", "응답을 찾을 수 없습니다.")
#             logger.info(f"GPT 응답: {result['result'][:200]}...")
#         elif isinstance(result, str):
#             answer_text = result
#         else:
#             logger.warning(f"예상치 못한 결과 형식: {type(result)}")
#             answer_text = str(result)
        
#         # 좌표 정보 추출
#         evidence_coordinates = []
        
#         # 소스 문서에서 가장 관련성 높은 문서 선택
#         if "source_documents" in result and result["source_documents"]:
#             # 기존 시스템에서는 문서 ID가 없으므로 첫 번째 문서 사용
#             best_doc = result["source_documents"][0]
            
#             # 메타데이터에서 좌표 추출
#             if hasattr(best_doc, 'metadata') and 'top_y' in best_doc.metadata and 'bottom_y' in best_doc.metadata:
#                 evidence_coordinates.append({
#                     "top_y": best_doc.metadata['top_y'],
#                     "bottom_y": best_doc.metadata['bottom_y']
#                 })
#                 logger.info(f"문서 좌표 추출: top_y={best_doc.metadata['top_y']}, bottom_y={best_doc.metadata['bottom_y']}")
        
#         # 응답 구성
#         response = {
#             "answer": answer_text,
#             "source_documents": [],
#             "evidence_coordinates": evidence_coordinates
#         }
        
#         # 소스 문서 추가
#         if "source_documents" in result:
#             response["source_documents"] = [
#                 {
#                     "content": doc.page_content,
#                     "metadata": doc.metadata if hasattr(doc, 'metadata') else {}
#                 } for doc in result["source_documents"]
#             ]
        
#         logger.info("질의 처리 완료")
#         return response
        
#     except Exception as e:
#         logger.error(f"질의 처리 중 오류: {str(e)}")
#         import traceback
#         logger.error(traceback.format_exc())
        
#         # 간소화된 답변 반환
#         return {
#             "answer": f"죄송합니다, 질문에 답변하는 과정에서 오류가 발생했습니다 뿌우...",
#             "error": str(e),
#             "source_documents": [],
#             "evidence_coordinates": []
#         }
    


# gpt 다시 시도 ver
def query_rag_system(chain, query, concert_id=None):
    """RAG 시스템에 질의합니다."""
    logger.info(f"질의 처리 중: '{query}'")
    
    # 검색 필터 설정 (특정 콘서트만 검색)
    if concert_id and hasattr(chain, 'retriever'):
        # 검색 필터 설정 시도
        try:
            chain.retriever.search_kwargs.update({"filter": {"concert_id": concert_id}})
        except Exception as e:
            logger.warning(f"검색 필터 설정 실패 (무시됨): {str(e)}")
    
    try:
        # 1. 수동으로 검색 수행
        docs = None
        try:
            # 직접 검색
            docs = chain.retriever.get_relevant_documents(query)
            logger.info(f"검색 결과: {len(docs)}개 문서 검색됨")
        except Exception as e:
            logger.error(f"검색 중 오류 발생: {str(e)}")
            # 백업 방식: 체인 호출 후 source_documents 사용
            result = chain({"query": query})
            if "source_documents" in result:
                docs = result["source_documents"]
                logger.info(f"백업 방식으로 {len(docs)}개 문서 검색됨")
        
        if not docs:
            raise ValueError("검색 결과가 없습니다")
        
        # 2. 원본 콘텐츠 저장
        original_contents = {}
        for i, doc in enumerate(docs):
            original_contents[i] = doc.page_content
            
            # ID 부여된 콘텐츠로 변경
            doc.page_content = f"[문서 #{i+1}]\n{doc.page_content}\n[문서 #{i+1} 끝]"
        
        # 3. 검색 결과를 컨텍스트로 변환
        context = "\n\n".join([doc.page_content for doc in docs])
        
        # 4. 직접 OpenAI API 호출 (LangChain에 의존하지 않음)
        from openai import OpenAI
        client = OpenAI()
        
        # 커스텀 프롬프트
        prompt = f"""
당신은 콘서트 관련 정보를 제공하는 도우미인 '콘끼리봇'입니다. 
아래 제공된 콘서트 공지사항 정보를 바탕으로 사용자의 질문에 정확하게 답변해주세요.
말끝마다 '뿌우'를 붙여주세요. 예: "안녕하세요, 뿌우"

<콘서트_정보>
{context}
</콘서트_정보>

질문: {query}

다음 지침에 따라 답변해주세요:
1. 콘서트 공지사항 정보를 기반으로 질문에 답변하세요.
2. 답변의 출처가 되는 가장 중요한 문서 ID를 명시하세요.
3. 아래 형식으로 정확히 응답하세요:

[답변]
당신의 답변 내용을 여기에 작성하세요.

[참조_문서]
가장 관련성 높은 문서 ID 하나만 선택 (예: #2)
"""
        
        # API 호출
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "너는 콘서트 정보를 알려주는 콘끼리 챗봇이야."},
                {"role": "user", "content": prompt}
            ],
            temperature=0,
        )
        
        # 응답 텍스트 추출
        answer_text = response.choices[0].message.content
        logger.info(f"GPT 응답: {answer_text[:200]}...")
        
        # 5. GPT 응답 파싱
        import re
        answer_match = re.search(r'\[답변\](.*?)(?=\[참조_문서\]|\Z)', answer_text, re.DOTALL)
        doc_match = re.search(r'\[참조_문서\]\s*#?(\d+)', answer_text)
        
        if answer_match:
            answer = answer_match.group(1).strip()
        else:
            answer = answer_text
        
        # 6. 좌표 정보 추출
        evidence_coordinates = []
        referenced_doc_id = None
        
        if doc_match:
            try:
                # 참조 문서 ID 추출 (1부터 시작)
                referenced_doc_id = int(doc_match.group(1)) - 1  # 0-based 인덱스로 변환
                logger.info(f"참조된 문서 ID: #{referenced_doc_id+1}")
                
                if 0 <= referenced_doc_id < len(docs):
                    # 해당 문서의 메타데이터에서 좌표 추출
                    doc = docs[referenced_doc_id]
                    if hasattr(doc, 'metadata') and 'top_y' in doc.metadata and 'bottom_y' in doc.metadata:
                        evidence_coordinates.append({
                            "top_y": doc.metadata['top_y'],
                            "bottom_y": doc.metadata['bottom_y']
                        })
                        logger.info(f"문서 #{referenced_doc_id+1}에서 좌표 추출: top_y={doc.metadata['top_y']}, bottom_y={doc.metadata['bottom_y']}")
                    else:
                        logger.warning(f"문서 #{referenced_doc_id+1}에 좌표 메타데이터가 없습니다")
                else:
                    logger.warning(f"참조된 문서 ID #{referenced_doc_id+1}가 유효하지 않습니다. 총 문서 수: {len(docs)}")
            except (ValueError, IndexError) as e:
                logger.warning(f"참조 문서 ID 처리 오류: {str(e)}")
        else:
            logger.warning("GPT 응답에서 참조 문서 ID를 찾을 수 없습니다")
            
            # ID를 찾지 못한 경우 첫 번째 문서의 좌표 사용 (폴백)
            if docs:
                doc = docs[0]
                if hasattr(doc, 'metadata') and 'top_y' in doc.metadata and 'bottom_y' in doc.metadata:
                    evidence_coordinates.append({
                        "top_y": doc.metadata['top_y'],
                        "bottom_y": doc.metadata['bottom_y']
                    })
                    logger.info(f"ID 없어 첫 번째 문서의 좌표 사용: top_y={doc.metadata['top_y']}, bottom_y={doc.metadata['bottom_y']}")
        
        # 7. 문서 콘텐츠 복원
        for i, doc in enumerate(docs):
            if i in original_contents:
                doc.page_content = original_contents[i]
        
        # 8. 응답 구성
        response_dict = {
            "answer": answer,
            "source_documents": [],
            "evidence_coordinates": evidence_coordinates,
            "referenced_doc_id": referenced_doc_id
        }
        
        # 소스 문서 추가 (원본 콘텐츠로 복원)
        response_dict["source_documents"] = [
            {
                "content": doc.page_content,
                "metadata": doc.metadata if hasattr(doc, 'metadata') else {}
            } for doc in docs
        ]
        
        logger.info("질의 처리 완료")
        return response_dict
        
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