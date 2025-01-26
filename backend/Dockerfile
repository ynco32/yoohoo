# 빌드 스테이지
FROM gradle:7.6.1-jdk17 AS build

WORKDIR /app                    # 작업 디렉토리 설정

COPY build.gradle settings.gradle /app/  # Gradle 설정 파일 복사

COPY src /app/src              # 소스 코드 복사

RUN gradle build -x test       # 테스트 제외하고 빌드

# 실행 스테이지
FROM openjdk:17-slim           # 실행용 경량 이미지

COPY --from=build /app/build/libs/*.jar app.jar  # 빌드된 jar 복사

EXPOSE 8080                    # 포트 설정

ENTRYPOINT ["java","-jar","/app.jar"]  # 실행 명령어