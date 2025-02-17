# Node.js 경량 이미지
FROM node:18-alpine

# 작업 디렉토리
WORKDIR /app

# package.json 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# 빌드 시 환경변수를 받아옵니다
ARG NEXT_PUBLIC_KAKAO_MAP_API_KEY
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SKT_API_KEY

# 환경변수 설정
ENV NEXT_PUBLIC_KAKAO_MAP_API_KEY=$NEXT_PUBLIC_KAKAO_MAP_API_KEY
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SKT_API_KEY=$NEXT_PUBLIC_SKT_API_KEY


# 프로젝트 빌드
RUN npm run build

# 포트 설정
EXPOSE 3000

# 실행 명령어
CMD ["npm", "start"]
