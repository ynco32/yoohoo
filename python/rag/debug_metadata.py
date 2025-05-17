import os
import logging
from dotenv import load_dotenv
from pinecone import Pinecone
from langchain_pinecone import PineconeVectorStore
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import RetrievalQA

# 환경 변수 로드
load_dotenv()

# 로깅 설정
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# 설정 값
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = "concert"
CONCERT_ID = 41  # 테스트할 콘서트 ID

def setup_vectorstore():
    """벡터 저장소에 연결합니다."""
    embeddings = OpenAIEmbeddings(
        model="text-embedding-3-small",
        openai_api_key=OPENAI_API_KEY
    )
    
    # 네임스페이스 설정
    namespace = f"concert_id_{CONCERT_ID}"
    logger.info(f"네임스페이스 '{namespace}'를 사용합니다.")
    
    # Pinecone 벡터 스토어 설정
    vectorstore = PineconeVectorStore.from_existing_index(
        index_name=PINECONE_INDEX_NAME,
        embedding=embeddings,
        text_key="text",
        namespace=namespace
    )
    
    return vectorstore

def create_simple_chain(vectorstore):
    """간단한 RAG 체인을 생성합니다."""
    llm = ChatOpenAI(
        api_key=OPENAI_API_KEY,
        model_name="gpt-3.5-turbo",
        temperature=0
    )
    
    # 간단한 프롬프트 템플릿
    prompt_template = """질문: {question}\n\n컨텍스트: {context}\n\n답변:"""
    PROMPT = PromptTemplate(
        template=prompt_template, 
        input_variables=["context", "question"]
    )
    
    # 체인 생성
    chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vectorstore.as_retriever(search_kwargs={"k": 5}),
        return_source_documents=True,
        chain_type_kwargs={"prompt": PROMPT}
    )
    
    return chain

def debug_metadata(vectorstore, query="공연 시간이 언제인가요?"):
    """메타데이터 디버깅을 수행합니다."""
    logger.info(f"쿼리: '{query}'")
    
    # 문서 검색
    docs = vectorstore.similarity_search(query, k=5)
    
    # 검색 결과 확인
    if docs:
        logger.info(f"검색된 문서 수: {len(docs)}")
        
        # 첫 번째 문서 확인
        doc = docs[0]
        logger.info(f"문서 타입: {type(doc)}")
        logger.info(f"문서 내용 일부: {doc.page_content[:100]}...")
        
        # 메타데이터 확인
        if hasattr(doc, 'metadata'):
            metadata = doc.metadata
            logger.info(f"메타데이터 타입: {type(metadata)}")
            logger.info(f"메타데이터 키: {list(metadata.keys())}")
            logger.info(f"전체 메타데이터: {metadata}")
            
            # 중요 필드 확인
            for key in ['concert_name', 'arena_name', 'artists', 'ticketing_platform']:
                logger.info(f"{key}: {metadata.get(key, '없음')}")
        else:
            logger.info("문서에 metadata 속성이 없습니다.")
    else:
        logger.info("검색된 문서가 없습니다.")

if __name__ == "__main__":
    try:
        logger.info("메타데이터 디버깅 시작...")
        vectorstore = setup_vectorstore()
        debug_metadata(vectorstore)
        logger.info("디버깅 완료!")
    except Exception as e:
        logger.error(f"오류 발생: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())