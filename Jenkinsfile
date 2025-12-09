pipeline {
    agent any

    environment {
        SONAR_HOST_URL = "http://v2code.rtwohealthcare.com"
        SONAR_TOKEN    = "sqp_b9c95d8c8334c110a2193cbc9ef7b72b3e707d99"
    }

    stages {

        stage('Checkout') {
            steps { checkout scm }
        }

        stage('Install & Test Python Code') {
            steps {
                sh """
                    docker run --rm \
                        -v ${WORKSPACE}/backend:/app \
                        -w /app python:3.10-slim sh -c "
                            pip install --upgrade pip &&
                            pip install -r requirements.txt &&
                            pytest --disable-warnings --maxfail=1 -q || true
                        "
                """
            }
        }

        stage('SonarQube Analysis') {
            steps {
                echo "Running Legacy Sonar Scanner (4.6) for old SonarQube"

                sh """
                    
                    
                
                        -v ${WORKSPACE}:/src \
                        -w /src sonar-scanner-custom \
                       sonar-scanner.bat 
                       -D"sonar.projectKey=python" 
                       -D"sonar.sources=." 
                       -D"sonar.host.url=https://v2code.rtwohealthcare.com" 
                       -D"sonar.token=sqp_b9c95d8c8334c110a2193cbc9ef7b72b3e707d99"





                """
            }
        }
    }
}
