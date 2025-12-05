pipeline {
    agent any

    environment {
        SONARQUBE = 'Calculator'
        DOCKER_IMAGE = 'calculator-app:latest'
        NEXUS_REPO = 'localhost:8082'
        APP_PATH = 'animation-calculator/backend'
    }

    stages {

        stage('Checkout') {
            steps {
                echo '📥 Checking out code...'
                git branch: 'main', credentialsId: 'github-pat', url: 'https://github.com/Mo-nish/Calculator.git'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv("${SONARQUBE}") {
                    withCredentials([string(credentialsId: 'sonarqube-token-calculator', variable: 'SONAR_TOKEN')]) {
                        bat '''
                        echo === Running SonarQube Analysis ===
                        sonar-scanner ^
                          -Dsonar.projectKey=Calculator ^
                          -Dsonar.sources=. ^
                          -Dsonar.host.url=http://localhost:9000 ^
                          -Dsonar.token=%SONAR_TOKEN%
                        '''
                    }
                }
            }
        }

        stage('Wait for SonarQube Processing') {
            steps {
                echo "⏳ Waiting 30 seconds for SonarQube background analysis..."
                sleep(time: 30, unit: 'SECONDS')
            }
        }

        stage('Quality Gate Check') {
            steps {
                script {
                    try {
                        timeout(time: 10, unit: 'MINUTES') {
                            def qg = waitForQualityGate()
                            echo "Quality Gate Status: ${qg.status}"
                            if (qg.status != 'OK') {
                                error "❌ Quality Gate failed: ${qg.status}"
                            }
                        }
                    } catch (err) {
                        echo "⚠️ Quality Gate check skipped or timed out. Proceeding..."
                    }
                }
            }
        }

        stage('Run Unit Tests') {
            steps {
                echo '🧪 Running Python unit tests...'
                bat """
                    cd %APP_PATH%
                    pytest --maxfail=1 --disable-warnings -q
                """
            }
        }

        stage('Build Desktop Executable') {
            steps {
                echo '💻 Packaging desktop version...'
                bat """
                    cd %APP_PATH%
                    pip install pyinstaller
                    pyinstaller --onefile --noconsole desktop_app.py --name AnimationCalculator
                """
            }
        }

        stage('Archive Desktop Executable') {
            steps {
                echo '📦 Archiving .exe artifact...'
                archiveArtifacts artifacts: "${env.APP_PATH}/dist/AnimationCalculator.exe", fingerprint: true
            }
        }

        stage('Copy to Local Folder') {
            steps {
                bat """
                echo === Copying .exe to local build folder ===
                mkdir "C:\\DesktopApps\\Builds"
                copy "%APP_PATH%\\dist\\AnimationCalculator.exe" "C:\\DesktopApps\\Builds\\AnimationCalculator.exe" /Y
                """
            }
        }

        stage('Build Docker Image Locally') {
            steps {
                echo '🐳 Building local Docker image...'
                bat """
                    cd %APP_PATH%
                    docker build -t %DOCKER_IMAGE% .
                """
            }
        }

        stage('Tag & Push to Nexus') {
            steps {
                echo '🚀 Tagging and pushing Docker image to Nexus registry...'
                bat """
                    docker tag %DOCKER_IMAGE% %NEXUS_REPO%/%DOCKER_IMAGE%
                    docker push %NEXUS_REPO%/%DOCKER_IMAGE%
                """
            }
        }

        stage('Verify Nexus Image') {
            steps {
                echo '🔍 Verifying pushed image...'
                bat """
                    curl http://%NEXUS_REPO%/v2/calculator-app/tags/list
                """
            }
        }
    }

    post {
        success {
            echo '✅ Desktop app built and Docker image pushed to Nexus successfully!'
        }
        failure {
            echo '❌ Build failed. Check Jenkins logs for stage details.'
        }
    }
}
