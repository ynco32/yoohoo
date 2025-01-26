pipeline {  // 파이프라인 정의 시작
    agent any  // Jenkins 에이전트에서 어떤 노드에서든 실행 가능
    
    environment {  // 파이프라인에서 사용할 환경 변수 정의
        DOCKER_COMPOSE = 'docker-compose'  // docker-compose 명령어를 환경 변수로 설정
    }
    
    stages {  // 파이프라인의 주요 단계들 정의
        stage('Checkout') {  // 첫 번째 단계: 코드 체크아웃
            steps {
                checkout scm  // 소스 코드 관리(SCM)에서 현재 브랜치의 코드 체크아웃
            }
        }
        
        stage('Build and Test') {  // 두 번째 단계: 빌드와 테스트
            failFast true  // 하나라도 실패하면 전체 중단
            parallel {  // 병렬로 Backend와 Frontend 작업 수행
                stage('Backend') {  // Backend 처리 단계
                    when {  // 조건 설정
                        anyOf {  // 아래 브랜치에서만 실행
                            branch 'dev-be*'  // dev-be로 시작하는 브랜치
                            branch 'dev'  // dev 브랜치
                            branch 'master'  // master 브랜치
                        }
                    }
                    steps {  // Backend 빌드 및 테스트 수행
                        dir('backend') {  // backend 디렉토리로 이동
                            sh './gradlew clean build test'  // Gradle로 클린 빌드 및 테스트 실행
                        }
                    }
                }
                
                stage('Frontend') {  // Frontend 처리 단계
                    when {  // 조건 설정
                        anyOf {  // 아래 브랜치에서만 실행
                            branch 'dev-fe*'  // dev-fe로 시작하는 브랜치
                            branch 'dev'  // dev 브랜치
                            branch 'master'  // master 브랜치
                        }
                    }
                    steps {  // Frontend 빌드 및 테스트 수행
                        dir('frontend') {  // frontend 디렉토리로 이동
                            sh 'npm install'  // 필요한 패키지 설치
                            sh 'npm run test'  // 테스트 실행
                            sh 'npm run build'  // 빌드 실행
                        }
                    }
                }
            }
        }
        
        stage('Docker Build and Deploy') {  // Docker 빌드 및 배포 단계
            when {  // 조건 설정
                anyOf {  // 아래 브랜치에서만 실행
                    branch 'dev-be'  // dev-be 브랜치
                    branch 'dev-fe'  // dev-fe 브랜치
                    branch 'dev'  // dev 브랜치
                    branch 'master'  // master 브랜치
                }
            }
            steps {  // Docker 빌드 및 배포 수행
                script {  // 스크립트 블록: 여러 스크립트 실행 가능
                    withCredentials([  // Jenkins 크리덴셜에서 환경 변수 가져오기
                        string(credentialsId: 'DB_URL', variable: 'DB_URL'),
                        string(credentialsId: 'DB_USERNAME', variable: 'DB_USERNAME'),
                        string(credentialsId: 'DB_PASSWORD', variable: 'DB_PASSWORD'),
                        string(credentialsId: 'KAKAO_CLIENT_ID', variable: 'KAKAO_CLIENT_ID'),
                        string(credentialsId: 'KAKAO_CLIENT_SECRET', variable: 'KAKAO_CLIENT_SECRET'),
                        string(credentialsId: 'JWT_SECRET_KEY', variable: 'JWT_SECRET_KEY'),
                        string(credentialsId: 'MYSQL_USER', variable: 'MYSQL_USER'),
                        string(credentialsId: 'MYSQL_PASSWORD', variable: 'MYSQL_PASSWORD'),
                        string(credentialsId: 'MYSQL_ROOT_PASSWORD', variable: 'MYSQL_ROOT_PASSWORD')
                    ]) {
                        sh "${DOCKER_COMPOSE} down"  // 기존 컨테이너 중지 및 삭제
                        sh "${DOCKER_COMPOSE} build"  // Docker 이미지 빌드
                        sh "${DOCKER_COMPOSE} up -d"  // 컨테이너를 백그라운드 모드로 실행
                    }
                }
            }
        }
    }
    
    post {  // 파이프라인 종료 후 처리
        success {  // 파이프라인 성공 시 메시지 출력
            echo 'Pipeline succeeded!'
        }
        failure {  // 파이프라인 실패 시 메시지 출력
            echo 'Pipeline failed!'
            sh "${DOCKER_COMPOSE} down"
            sh "${DOCKER_COMPOSE} logs > pipeline_failure.log"  // 실패 시 로그 저장  
        }
    }
}
