# SonarQube Configuration Fix Guide

## Problem
The Jenkins pipeline is failing with:
```
ERROR: SonarQube installation defined in this job (SonarQube) does not match any configured installation.
```

## Root Cause
The Jenkinsfile references a SonarQube server named `"SonarQube"`, but this server name doesn't exist in your Jenkins configuration.

## Solution: Find and Update the Correct Server Name

### Step 1: Find the SonarQube Server Name in Jenkins

1. **Open Jenkins Dashboard**
   - Go to your Jenkins URL (e.g., http://localhost:8080)

2. **Navigate to Global Configuration**
   - Click **"Manage Jenkins"** in the left sidebar
   - Click **"Configure System"** (or **"System Configuration"**)

3. **Find SonarQube Section**
   - Scroll down to find the **"SonarQube servers"** section
   - You should see a configured SonarQube server with a **Name** field

4. **Copy the Exact Server Name**
   - The name might be something like:
     - `SonarQube` (if configured)
     - `localhost` (if using default)
     - `sonarqube-server`
     - Or any custom name you set

### Step 2: Update the Jenkinsfile

Once you know the correct server name, update line 6 in `animation-calculator/Jenkinsfile`:

```groovy
environment {
    VENV_PATH = 'venv'
    SONARQUBE = 'YOUR_ACTUAL_SERVER_NAME'  // Replace with the name from Step 1
}
```

### Step 3: Verify SonarQube Scanner is Installed

The pipeline uses `sonar-scanner` command. Make sure it's available:

1. **Check if sonar-scanner is installed on Jenkins server:**
   ```powershell
   sonar-scanner --version
   ```

2. **If not installed:**
   - Download from: https://docs.sonarqube.org/latest/analyzing-source-code/scanners/sonarscanner/
   - Install it on the Jenkins server
   - Add it to PATH environment variable

### Step 4: Verify SonarQube Server is Running

1. **Check if SonarQube is running:**
   - Open: http://localhost:9000 (or your SonarQube URL)
   - You should see the SonarQube dashboard

2. **Verify the server URL in Jenkins matches:**
   - In Jenkins Configure System → SonarQube servers
   - Make sure the Server URL matches your running SonarQube instance

## Alternative: If SonarQube Server is NOT Configured in Jenkins

If you don't have a SonarQube server configured in Jenkins yet:

1. **Install SonarQube Plugin:**
   - Go to: Manage Jenkins → Manage Plugins
   - Search for "SonarQube Scanner"
   - Install it

2. **Configure SonarQube Server:**
   - Go to: Manage Jenkins → Configure System
   - Scroll to "SonarQube servers"
   - Click "Add SonarQube"
   - Fill in:
     - **Name**: `SonarQube` (or any name you prefer)
     - **Server URL**: `http://localhost:9000` (or your SonarQube URL)
     - **Server authentication token**: Your SonarQube token

3. **Generate SonarQube Token (if needed):**
   - Login to SonarQube (default: admin/admin)
   - Go to: My Account → Security
   - Generate a new token
   - Use this token in Jenkins configuration

## What Was Fixed in the Jenkinsfile

1. ✅ Removed redundant configuration (host URL and login token - handled by `withSonarQubeEnv`)
2. ✅ Using `sonar-project.properties` file for cleaner configuration
3. ✅ Proper directory navigation before running sonar-scanner

## Testing

After making changes:
1. Commit and push the updated Jenkinsfile
2. Run the Jenkins pipeline
3. Check the "SonarQube Analysis" stage in the pipeline output

## Notes

- The `withSonarQubeEnv` block automatically injects the SonarQube server URL and authentication token
- The `sonar-project.properties` file contains the project-specific settings
- Make sure the server name in the Jenkinsfile **exactly matches** the name in Jenkins configuration (case-sensitive)

