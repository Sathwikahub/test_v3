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

        

        stage('SonarQube Analysis') {
            steps {
                echo "Running Legacy Sonar Scanner (4.6) for old SonarQube"

                sh """
                    
                    
                
                    
                        -w /src sonar-scanner-custom \
                       sonar-scanner.bat 
                       -D"sonar.projectKey=python" 
                       -D"sonar.sources=backend" 
                       -D"sonar.host.url=https://v2code.rtwohealthcare.com" 
                       -D"sonar.token=sqp_b9c95d8c8334c110a2193cbc9ef7b72b3e707d99"





                """
            }
        }
    }
}
