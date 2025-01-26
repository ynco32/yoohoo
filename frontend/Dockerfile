FROM node:18-alpine           # Node.js 경량 이미지

WORKDIR /app                  # 작업 디렉토리

COPY package*.json ./         # package.json 파일 복사

RUN npm install              # 의존성 설치

COPY . .                     # 소스 코드 복사

RUN npm run build           # 프로젝트 빌드

EXPOSE 3000                 # 포트 설정

CMD ["npm", "start"]        # 실행 명령어