# 빌드 스테이지
FROM gradle:7.6.1-jdk17 AS build

# 작업 디렉토리 설정
WORKDIR /app

# Gradle 설정 파일 복사
COPY build.gradle settings.gradle /app/

# 소스 코드 복사
COPY src /app/src

# 테스트 제외하고 빌드
RUN gradle build -x test

# 실행 스테이지
FROM openjdk:17-slim

# 빌드된 jar 복사
COPY --from=build /app/build/libs/*.jar app.jar

# 포트 설정
EXPOSE 8080

# 실행 명령어
ENTRYPOINT ["java","-jar","/app.jar"]
