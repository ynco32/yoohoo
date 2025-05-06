# Node.js 20.18 버전을 기반으로 하는 이미지 사용
FROM node:20.18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# Yarn 설치
RUN apk add --no-cache yarn

# package.json과 yarn.lock 파일 복사
COPY package.json yarn.lock ./

# 의존성 설치
RUN yarn install

# 소스 코드 복사
COPY . .

# 빌드 시 환경변수를 받아옵니다
ARG NEXT_PUBLIC_KAKAO_MAP_API_KEY
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SKT_API_KEY
ARG NEXT_PUBLIC_SKT_API_URL

# 환경변수 설정
ENV NEXT_PUBLIC_KAKAO_MAP_API_KEY=$NEXT_PUBLIC_KAKAO_MAP_API_KEY
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SKT_API_KEY=$NEXT_PUBLIC_SKT_API_KEY
ENV NEXT_PUBLIC_SKT_API_URL=$NEXT_PUBLIC_SKT_API_URL

# 빌드
RUN yarn build

# 포트 설정
EXPOSE 3000

# 애플리케이션 실행
CMD ["yarn", "start"]
