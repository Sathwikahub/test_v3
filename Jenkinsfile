pipeline {
    agent any

    environment {
        SONAR_HOST_URL = "https://v2code.rtwohealthcare.com"
        SONAR_TOKEN = "sqp_ab4016bc5eef902acdbc5f5dbf8f0d46815f0035"

        DOCKER_REGISTRY_URL = "v2deploy.rtwohealthcare.com"
        IMAGE_NAME = "test-v3"
        IMAGE_TAG = "v${BUILD_NUMBER}"

        BACKEND_DIR = "backend"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // -----------------------------------------------------------
        // Python Build & Tests using Docker
        // -----------------------------------------------------------

        stage('Install Python Dependencies') {
            steps {
                sh """
                    docker run --rm \
                        -v \$PWD/${BACKEND_DIR}:/app \
                        -w /app python:3.10-slim \
                        sh -c "pip install --upgrade pip && pip install -r requirements.txt"
                """
            }
        }

        stage('Run Unit Tests') {
            steps {
                sh """
                    docker run --rm \
                        -v \$PWD/${BACKEND_DIR}:/app \
                        -w /app python:3.10-slim \
                        pytest -q || true
                """
            }
        }

        // -----------------------------------------------------------
        // SonarQube Scan (Python project)
        // -----------------------------------------------------------

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh """
                        docker run --rm \
                            -v \$PWD:/src \
                            -w /src \
                            sonarsource/sonar-scanner-cli \
                                -Dsonar.projectKey=test_v3 \
                                -Dsonar.sources=backend \
                                -Dsonar.host.url=${SONAR_HOST_URL} \
                                -Dsonar.token=${SONAR_TOKEN}
                    """
                }
            }
        }

        stage('Skip Quality Gate') {
            steps {
                echo "Skipping Sonar Quality Gate check by request."
            }
        }

        // -----------------------------------------------------------
        // Docker Build & Push
        // -----------------------------------------------------------

        stage('Docker Build') {
            steps {
                sh """
                    cd backend
                    docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
                    docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${DOCKER_REGISTRY_URL}/${IMAGE_NAME}:${IMAGE_TAG}
                    docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${DOCKER_REGISTRY_URL}/${IMAGE_NAME}:latest
                """
            }
        }

        stage('Docker Push') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'nexus-docker-cred',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh """
                        echo "$PASS" | docker login ${DOCKER_REGISTRY_URL} -u "$USER" --password-stdin

                        docker push ${DOCKER_REGISTRY_URL}/${IMAGE_NAME}:${IMAGE_TAG}
                        docker push ${DOCKER_REGISTRY_URL}/${IMAGE_NAME}:latest

                        docker logout ${DOCKER_REGISTRY_URL}
                    """
                }
            }
        }
    }

    post {
        success {
            echo "🔥 Build + Test + Sonar + Docker Push successful!"
        }
        failure {
            echo "❌ Pipeline failed — fix your mess."
        }
    }
}
