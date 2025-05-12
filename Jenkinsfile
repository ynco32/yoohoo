pipeline {  // 파이프라인 정의 시작

    agent any

/*
1. BRANCH_NAME 변수 설정
2. DEPLOY_ENV 변수 설정
3. ddukdoc 으로 되어있는 부분 확인해서 고치기
4. 컨테이너 이름 정해놓기
*/
    
    environment {  // 파이프라인에서 사용할 환경 변수 정의
        BRANCH_NAME = "${env.BRANCH_NAME ?: "dev"}"
        DEPLOY_ENV = "${env.DEPLOY_ENV}"
        NGINX_CONF_PATH = '/home/ubuntu/nginx/conf.d'
        NGINX_HTML_PATH = '/home/ubuntu/nginx/html'
        DOCKER_COMPOSE_PATH = '/home/ubuntu'
        BACKEND_CONTAINER_NAME = "backend-${env.BRANCH_NAME}"
        FRONTEND_CONTAINER_NAME = "frontend-${env.BRANCH_NAME}"
        BACKEND_NEW_CONTAINER_NAME = "backend-${env.BRANCH_NAME}-new"
        FRONTEND_NEW_CONTAINER_NAME = "frontend-${env.BRANCH_NAME}-new"
    }
    
    stages {  // 파이프라인의 주요 단계들 정의

        stage('Debug') {  // 현재 브랜치 디버깅용 스테이지
            steps {
                sh 'whoami'
                sh 'id'
                script {
                    echo "Current Branch: ${BRANCH_NAME}"
                    // Git 저장소 권한 설정
                    sh 'git config --global --add safe.directory /var/jenkins_home/workspace/dev'
                }
            }
        }
        
        stage('Checkout') {  // 첫 번째 단계: 코드 체크아웃
            steps {
                checkout scm  // 소스 코드 관리(SCM)에서 현재 브랜치의 코드 체크아웃
                script {
                    echo "Checked out Branch: ${BRANCH_NAME}"
                }
            }
        }

        stage('Check Changes') {
            steps {
                script {
                    try {
                        // Git 저장소 초기화 확인
                        sh 'git config --global --add safe.directory /var/jenkins_home/workspace/dev'
                        
                        // 현재 커밋 해시 가져오기
                        def currentCommit = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
                        
                        // 이전 커밋이 있는지 확인
                        def hasPreviousCommit = sh(script: 'git rev-parse HEAD^ 2>/dev/null || echo "no_previous"', returnStdout: true).trim()
                        
                        if (hasPreviousCommit == 'no_previous') {
                            // 초기 커밋인 경우
                            env.FRONTEND_CHANGES = 'true'
                            env.BACKEND_CHANGES = 'true'
                        } else {
                            // 변경된 파일 목록 가져오기
                            def changedFiles = sh(script: 'git diff --name-only HEAD^ HEAD', returnStdout: true).trim().split('\n')
                            
                            // 정확한 경로 매칭을 위한 정규식 패턴
                            def frontendPattern = ~/^frontend\//
                            def backendPattern = ~/^backend\//
                            
                            // 변경 여부 확인
                            env.FRONTEND_CHANGES = changedFiles.any { it =~ frontendPattern } ? 'true' : 'false'
                            env.BACKEND_CHANGES = changedFiles.any { it =~ backendPattern } ? 'true' : 'false'
                        }
                        
                        echo "Frontend 변경 여부: ${FRONTEND_CHANGES}"
                        echo "Backend 변경 여부: ${BACKEND_CHANGES}"
                    } catch (Exception e) {
                        echo "변경 사항 확인 중 오류 발생: ${e.getMessage()}"
                        // 오류 발생 시 안전하게 모든 변경사항이 있다고 가정
                        env.FRONTEND_CHANGES = 'true'
                        env.BACKEND_CHANGES = 'true'
                    }
                }
            }
        }
        
        stage('Build') {  // 빌드 단계
            failFast true  // 하나라도 실패하면 전체 중단
            parallel {
                stage('Frontend Build') {
                    // when {
                    //     expression { env.FRONTEND_CHANGES == 'true' }
                    // }
                    agent {
                        docker {
                        image 'node:20.18'       // Node 20.x 공식 이미지 (npm 내장)
                        args  '-u root'          // 필요하다면 root 권한으로
                        }
                    }
                    steps {
                        script {
                            try {
                                dir('frontend') {
                                    def credentialsList = []
                                    
                                    credentialsList.addAll([
                                        string(credentialsId: 'NEXT_PUBLIC_KAKAO_MAP_API_KEY', variable: 'NEXT_PUBLIC_KAKAO_MAP_API_KEY'),
                                        string(credentialsId: 'NEXT_PUBLIC_SKT_API_KEY', variable: 'NEXT_PUBLIC_SKT_API_KEY'),
                                        string(credentialsId: 'NEXT_PUBLIC_SKT_API_URL', variable: 'NEXT_PUBLIC_SKT_API_URL'),
                                    ])

                                    if (env.BRANCH_NAME == 'dev') {
                                        credentialsList.addAll([
                                            string(credentialsId: 'DEV_API_URL', variable: 'NEXT_PUBLIC_API_URL')
                                        ])
                                    } else if (env.BRANCH_NAME == 'master') {
                                        credentialsList.addAll([
                                            string(credentialsId: 'MASTER_API_URL', variable: 'NEXT_PUBLIC_API_URL')
                                        ])
                                    }

                                    withCredentials(credentialsList) {
                                        sh '''
                                            export NEXT_PUBLIC_KAKAO_MAP_API_KEY=$NEXT_PUBLIC_KAKAO_MAP_API_KEY
                                            export NEXT_PUBLIC_SKT_API_KEY=$NEXT_PUBLIC_SKT_API_KEY
                                            export NEXT_PUBLIC_SKT_API_URL=$NEXT_PUBLIC_SKT_API_URL
                                            export NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
                                            
                                            yarn install
                                            yarn build
                                        '''
                                    }
                                }
                            } catch (Exception e) {
                                env.FAILURE_STAGE = "프론트엔드 빌드"
                                env.FAILURE_MESSAGE = e.getMessage()
                                throw e
                            }
                        }
                    }
                }

                stage('Backend Build') {
                    // when {
                    //     expression { env.BACKEND_CHANGES == 'true' }
                    // }
                    steps {
                        script {
                            try {
                                dir('backend') {
                                    sh 'chmod +x gradlew'
                                    sh './gradlew clean build -x test'
                                    sh 'ls -la build/libs/ || echo "빌드 실패"'
                                }
                            } catch (Exception e) {
                                env.FAILURE_STAGE = "백엔드 빌드"
                                env.FAILURE_MESSAGE = e.getMessage()
                                throw e
                            }
                        }
                    }
                }
            }
        }

        stage('SonarQube Analysis') {
            failFast true
            parallel {
                stage('SonarQube Analysis - Backend') {
                    when {
                        allOf {
                            // expression { return env.BACKEND_CHANGES == 'true' }
                            expression { return env.BRANCH_NAME == 'dev' }
                        }
                    }
                    steps {
                        script {
                            try {
                                withSonarQubeEnv('sonarqube') {
                                    dir('backend') {
                                        sh """
                                            ./gradlew sonar \\
                                            -Dsonar.projectKey=Conkiri-backend \\
                                            -Dsonar.java.binaries=build/classes/java/main \\
                                            -Dsonar.java.source=17 \\
                                            -Dsonar.sourceEncoding=UTF-8 \\
                                            -Dsonar.exclusions=**/resources/**
                                        """
                                    }
                                }
                            } catch (Exception e) {
                                echo "SonarQube Backend 분석 중 오류가 발생했습니다: ${e.getMessage()}"
                            }
                        }
                    }
                }

                stage('SonarQube Analysis - Frontend') {
                    when {
                        allOf {
                            // expression { return env.FRONTEND_CHANGES == 'true' }
                            expression { return env.BRANCH_NAME == 'dev' }
                        }
                    }
                    agent {
                        docker {
                        image 'node:20.18'       // Node 20.x 공식 이미지 (npm 내장)
                        args  '-u root'          // 필요하다면 root 권한으로
                        }
                    }
                    steps {
                        script {
                            try {
                                def scannerHome = tool 'sonarqube'
                                withSonarQubeEnv('sonarqube') {
                                    dir('frontend') {
                                        sh """
                                        ${scannerHome}/bin/sonar-scanner \\
                                        -Dsonar.projectKey=Conkiri-frontend \\
                                        -Dsonar.sources=src \\
                                        -Dsonar.sourceEncoding=UTF-8 \\
                                        -Dsonar.typescript.tsconfigPath=sonar-tsconfig.json \\
                                        -Dsonar.exclusions=node_modules/** \\
                                        -Dsonar.issues.assign.issuesCreator=true
                                        """
                                    }
                                }
                            } catch (Exception e) {
                                echo "SonarQube Frontend 분석 중 오류가 발생했습니다: ${e.getMessage()}"
                            }
                        }
                    }
                }
            }
        }

        stage('Docker Build and Deploy') {
            steps {
                script {
                    try {
                        def credentialsList = []
                        
                        // 기본 credentials
                        credentialsList.addAll([
                            string(credentialsId: 'DB_USERNAME', variable: 'DB_USERNAME'),
                            string(credentialsId: 'DB_PASSWORD', variable: 'DB_PASSWORD'),
                            string(credentialsId: 'KAKAO_CLIENT_ID', variable: 'KAKAO_CLIENT_ID'),
                            string(credentialsId: 'KAKAO_CLIENT_SECRET', variable: 'KAKAO_CLIENT_SECRET'),
                            string(credentialsId: 'JWT_SECRET_KEY', variable: 'JWT_SECRET_KEY'),
                            string(credentialsId: 'MYSQL_USER', variable: 'MYSQL_USER'),
                            string(credentialsId: 'MYSQL_PASSWORD', variable: 'MYSQL_PASSWORD'),
                            string(credentialsId: 'MYSQL_ROOT_PASSWORD', variable: 'MYSQL_ROOT_PASSWORD'),
                            string(credentialsId: 'NEXT_PUBLIC_KAKAO_MAP_API_KEY', variable: 'NEXT_PUBLIC_KAKAO_MAP_API_KEY'),
                            string(credentialsId: 'AWS_ACCESS_KEY', variable: 'AWS_ACCESS_KEY'),
                            string(credentialsId: 'AWS_SECRET_KEY', variable: 'AWS_SECRET_KEY'),
                            string(credentialsId: 'AWS_REGION', variable: 'AWS_REGION'),
                            string(credentialsId: 'S3_BUCKET', variable: 'S3_BUCKET'),
                            string(credentialsId: 'NEXT_PUBLIC_SKT_API_KEY', variable: 'NEXT_PUBLIC_SKT_API_KEY'),
                            string(credentialsId: 'NEXT_PUBLIC_SKT_API_URL', variable: 'NEXT_PUBLIC_SKT_API_URL'),
                        ])
                        
                        // 브랜치별 추가 credentials
                        if (env.BRANCH_NAME == 'dev') {
                            credentialsList.addAll([
                                string(credentialsId: 'DEV_DB_URL', variable: 'DB_URL'),
                                string(credentialsId: 'DEV_REDIS_HOST', variable: 'REDIS_HOST'),
                                string(credentialsId: 'DEV_FRONTEND_URL', variable: 'FRONTEND_URL'),
                                string(credentialsId: 'DEV_API_URL', variable: 'NEXT_PUBLIC_API_URL'),
                                string(credentialsId: 'DEV_KAKAO_REDIRECT_URL', variable: 'KAKAO_REDIRECT_URI')
                            ])
                        } else if (env.BRANCH_NAME == 'master') {
                            credentialsList.addAll([
                                string(credentialsId: 'MASTER_DB_URL', variable: 'DB_URL'),
                                string(credentialsId: 'MASTER_REDIS_HOST', variable: 'REDIS_HOST'),
                                string(credentialsId: 'MASTER_FRONTEND_URL', variable: 'FRONTEND_URL'),
                                string(credentialsId: 'MASTER_API_URL', variable: 'NEXT_PUBLIC_API_URL'),
                                string(credentialsId: 'MASTER_KAKAO_REDIRECT_URL', variable: 'KAKAO_REDIRECT_URI')
                            ])
                        }
                        
                        withCredentials(credentialsList) {
                            // 현재 실행 중인 컨테이너 이름 저장
                            env.OLD_BACKEND_CONTAINER_NAME = sh(script: "docker ps --filter 'name=${env.BACKEND_CONTAINER_NAME}' --format '{{.Names}}'", returnStdout: true).trim()
                            env.OLD_FRONTEND_CONTAINER_NAME = sh(script: "docker ps --filter 'name=${env.FRONTEND_CONTAINER_NAME}' --format '{{.Names}}'", returnStdout: true).trim()
                            
                            sh '''
                                # Docker 빌드 및 새 버전 컨테이너 시작
                                docker compose -f docker-compose-${BRANCH_NAME}.yml build \
                                    --build-arg KAKAO_CLIENT_ID=$KAKAO_CLIENT_ID \
                                    --build-arg KAKAO_CLIENT_SECRET=$KAKAO_CLIENT_SECRET \
                                    --build-arg JWT_SECRET_KEY=$JWT_SECRET_KEY \
                                    --build-arg DB_URL=$DB_URL \
                                    --build-arg DB_USERNAME=$DB_USERNAME \
                                    --build-arg DB_PASSWORD=$DB_PASSWORD \
                                    --build-arg MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD \
                                    --build-arg MYSQL_USER=$MYSQL_USER \
                                    --build-arg MYSQL_PASSWORD=$MYSQL_PASSWORD \
                                    --build-arg FRONTEND_URL=$FRONTEND_URL \
                                    --build-arg KAKAO_REDIRECT_URI=$KAKAO_REDIRECT_URI \
                                    --build-arg NEXT_PUBLIC_KAKAO_MAP_API_KEY=$NEXT_PUBLIC_KAKAO_MAP_API_KEY \
                                    --build-arg AWS_ACCESS_KEY=$AWS_ACCESS_KEY \
                                    --build-arg AWS_SECRET_KEY=$AWS_SECRET_KEY \
                                    --build-arg AWS_REGION=$AWS_REGION \
                                    --build-arg S3_BUCKET=$S3_BUCKET \
                                    --build-arg REDIS_HOST=$REDIS_HOST \
                                    --build-arg NEXT_PUBLIC_SKT_API_KEY=$NEXT_PUBLIC_SKT_API_KEY \
                                    --build-arg NEXT_PUBLIC_SKT_API_URL=$NEXT_PUBLIC_SKT_API_URL \
                                    --build-arg NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
                                docker compose -f docker-compose-${BRANCH_NAME}.yml up -d
                                
                                # Nginx 설정 초기화
                                cp ${NGINX_CONF_PATH}/${BRANCH_NAME}.conf ${NGINX_CONF_PATH}/${BRANCH_NAME}.conf.backup
                                
                            '''
                                // # 초기 트래픽 설정 (90:10)
                                // sed -i "s/weight=[0-9]*/weight=90/g" ${NGINX_CONF_PATH}/${BRANCH_NAME}.conf
                                // sed -i "s/weight=[0-9]*/weight=10/g" ${NGINX_CONF_PATH}/${BRANCH_NAME}.conf
                                // docker exec nginx nginx -s reload
                        }

                        // 타임아웃 설정과 함께 카나리 배포 수행
                        // timeout(time: 1, unit: 'HOURS') {
                        //     def trafficPercentages = [10, 30, 50, 80, 100]
                        //     for (percentage in trafficPercentages) {
                        //         echo "트래픽 ${percentage}%로 증가 중..."
                                
                        //         // 트래픽 조정
                        //         sh """
                        //             sed -i "s/weight=[0-9]*/weight=${100-percentage}/g" ${env.NGINX_CONF_PATH}/${BRANCH_NAME}.conf
                        //             sed -i "s/weight=[0-9]*/weight=${percentage}/g" ${env.NGINX_CONF_PATH}/${BRANCH_NAME}.conf
                        //             docker exec nginx nginx -s reload
                        //         """
                                
                        //         // 15초 대기
                        //         sleep 15

                        //         // 백엔드 메트릭 체크
                        //         def backendMetrics = checkBackendMetrics()
                        //         echo "현재 백엔드 메트릭 - 에러율: ${backendMetrics.errorRate}, 응답시간: ${backendMetrics.responseTime}"
                                
                        //         // 프론트엔드 메트릭 체크
                        //         def frontendMetrics = checkFrontendMetrics()
                        //         echo "현재 프론트엔드 메트릭 - 에러율: ${frontendMetrics.errorRate}, 응답시간: ${frontendMetrics.responseTime}"
                                
                        //         if (!backendMetrics.isHealthy || !frontendMetrics.isHealthy) {
                        //             echo "메트릭 이상 감지. 롤백을 시작합니다."
                        //             rollbackDeployment()
                        //             error "트래픽 전환 과정 중 문제 발생. 롤백 수행"
                        //         }

                        //         // 100% 전환 완료 시 이전 버전 정리
                        //         if (percentage == 100) {
                        //             cleanupOldVersions()
                        //         }
                        //     }
                        // }
                    } catch (Exception e) {
                        env.FAILURE_STAGE = "Docker 빌드 및 배포"
                        env.FAILURE_MESSAGE = e.getMessage()
                        throw e
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo "환경 : ${env.DEPLOY_ENV} 배포 성공!"
            sh "docker ps | grep backend"

            script {
                def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                def changes = ""

                if (env.FRONTEND_CHANGES == 'true') {
                    changes += "Frontend"
                }
                if (env.BACKEND_CHANGES == 'true') {
                    if (changes) {
                        changes += ", Backend"
                    } else {
                        changes += "Backend"
                    }
                }
                if (!changes) {
                    changes = "설정 변경"
                }

                mattermostSend(
                        color: 'good',
                        message: "✅ 배포 성공: ${env.JOB_NAME} #${env.BUILD_NUMBER}\n" +
                                "👤 작성자: ${Author_ID} (${Author_Name})\n" +
                                "🔄 변경사항: ${changes}\n" +
                                "🌐 환경: ${env.DEPLOY_ENV}\n" +
                                "🔍 <${env.BUILD_URL}|상세 정보 보기>",
                        endpoint: 'https://meeting.ssafy.com/hooks/yg5p1dezhiybjj96hkenybd9ca',
                        channel: '9fujkh75xfy57joc3tsof6eryc'
                )
            }
        }

        failure {
            echo "환경 : ${env.DEPLOY_ENV} 배포 실패!"
            echo "실패 원인을 확인합니다."
            sh "docker ps -a | grep backend || echo '백엔드 컨테이너가 없습니다'"

            script {
                def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()

                // 실패 단계와 메시지 확인
                def failStage = env.FAILURE_STAGE ?: "알 수 없음"
                def failMessage = env.FAILURE_MESSAGE ?: "자세한 로그를 확인해주세요"

                mattermostSend(
                        color: 'danger',
                        message: "❌ 배포 실패: ${env.JOB_NAME} #${env.BUILD_NUMBER}\n" +
                                "👤 작성자: ${Author_ID} (${Author_Name})\n" +
                                "⚠️ 실패 단계: ${failStage}\n" +
                                "📝 실패 내용: ${failMessage}\n" +
                                "🌐 환경: ${env.DEPLOY_ENV}\n" +
                                "🔍 <${env.BUILD_URL}|상세 정보 보기>",
                        endpoint: 'https://meeting.ssafy.com/hooks/yg5p1dezhiybjj96hkenybd9ca',
                        channel: '9fujkh75xfy57joc3tsof6eryc'
                )
            }
        }

        always {
            echo "빌드 및 배포 과정이 종료되었습니다."
        }
    }

}

// 메트릭 체크 함수
def checkBackendMetrics() {
    def metrics = [
        isHealthy: true,
        errorRate: 0,
        responseTime: 0
    ]
    
    try {
        // 에러율 체크
        def response = sh(script: "curl -s -w '%{http_code}' http://localhost:8081/api/actuator/health", returnStdout: true).trim()
        def statusCode = response.tokenize('\n').last()
        metrics.errorRate = (statusCode == '200') ? 0 : 1
        
        // 응답시간 체크
        def responseTime = sh(script: "curl -s -w '%{time_total}' -o /dev/null http://localhost:8081/api/actuator/health", returnStdout: true).trim()
        metrics.responseTime = responseTime.toFloat()
        
        // 지표 검증
        if (metrics.errorRate > 0 || metrics.responseTime > 1000) {
            metrics.isHealthy = false
        }
    } catch (Exception e) {
        echo "백엔드 메트릭 체크 중 오류 발생: ${e.getMessage()}"
        metrics.isHealthy = false
    }
    
    return metrics
}

// 롤백 함수 통합
def rollbackDeployment() {
    sh """
        # 트래픽을 이전 버전으로 완전히 되돌림
        sed -i 's/weight=[0-9]*/weight=100/g' ${env.NGINX_CONF_PATH}/${BRANCH_NAME}.conf
        sed -i 's/weight=[0-9]*/weight=0/g' ${env.NGINX_CONF_PATH}/${BRANCH_NAME}.conf
        docker exec nginx nginx -s reload
        
        # 새 버전 컨테이너 중지 및 삭제
        docker stop ${env.BACKEND_NEW_CONTAINER_NAME} ${env.FRONTEND_NEW_CONTAINER_NAME} || true
        docker rm ${env.BACKEND_NEW_CONTAINER_NAME} ${env.FRONTEND_NEW_CONTAINER_NAME} || true
    """
}

// 배포 성공 후 정리 함수 통합
def cleanupOldVersions() {
    sh """
        # 이전 버전 컨테이너 중지 및 삭제
        if [ ! -z "${env.OLD_BACKEND_CONTAINER_NAME}" ]; then
            docker stop ${env.OLD_BACKEND_CONTAINER_NAME} || true
            docker rm ${env.OLD_BACKEND_CONTAINER_NAME} || true
        fi
        if [ ! -z "${env.OLD_FRONTEND_CONTAINER_NAME}" ]; then
            docker stop ${env.OLD_FRONTEND_CONTAINER_NAME} || true
            docker rm ${env.OLD_FRONTEND_CONTAINER_NAME} || true
        fi
        
        # 새 버전 컨테이너 이름 변경
        docker rename ${env.BACKEND_NEW_CONTAINER_NAME} ${env.BACKEND_CONTAINER_NAME}
        docker rename ${env.FRONTEND_NEW_CONTAINER_NAME} ${env.FRONTEND_CONTAINER_NAME}
    """
}

// 프론트엔드 메트릭 체크 함수
def checkFrontendMetrics() {
    def metrics = [
        isHealthy: true,
        errorRate: 0,
        responseTime: 0
    ]
    
    try {
        // 에러율 체크
        def response = sh(script: "curl -s -w '%{http_code}' http://localhost:3002/api/health", returnStdout: true).trim()
        def statusCode = response.tokenize('\n').last()
        metrics.errorRate = (statusCode == '200') ? 0 : 1
        
        // 응답시간 체크
        def responseTime = sh(script: "curl -s -w '%{time_total}' -o /dev/null http://localhost:3002/api/health", returnStdout: true).trim()
        metrics.responseTime = responseTime.toFloat()
        
        // 지표 검증
        if (metrics.errorRate > 0 || metrics.responseTime > 1000) {
            metrics.isHealthy = false
        }
    } catch (Exception e) {
        echo "프론트엔드 메트릭 체크 중 오류 발생: ${e.getMessage()}"
        metrics.isHealthy = false
    }
    
    return metrics
}
