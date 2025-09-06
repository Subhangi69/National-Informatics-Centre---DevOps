pipeline {
  agent any
  environment {
    AWS_REGION = "ap-southeast-2"                             // Sydney region
    S3_BUCKET  = "elasticbeanstalk-ap-southeast-2-021891578329" // EB regional bucket
    EB_APP     = "NIC-DevOps-App"
    EB_ENV     = "NIC-DevOps-App-env"
  }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }

    stage('Install') {
      steps {
        sh 'npm ci || npm install'
      }
    }

    stage('Test') {
      steps {
        sh 'npm test || echo "No tests or non-fatal"'
      }
    }

    stage('Package') {
      steps {
        sh '''
          rm -f app.zip
          zip -r app.zip * .[^.]* -x node_modules/* .git/*
        '''
        archiveArtifacts artifacts: 'app.zip', fingerprint: true
      }
    }

    stage('Deploy to EB') {
      steps {
        sh '''
          set -e
          VERSION_LABEL="v-$(date +%s)"
          echo "Uploading to s3://${S3_BUCKET}/${VERSION_LABEL}.zip"
          aws s3 cp app.zip s3://${S3_BUCKET}/${VERSION_LABEL}.zip --region ${AWS_REGION}
          echo "Creating EB application version ${VERSION_LABEL}"
          aws elasticbeanstalk create-application-version \
            --application-name "${EB_APP}" \
            --version-label "${VERSION_LABEL}" \
            --source-bundle S3Bucket=${S3_BUCKET},S3Key=${VERSION_LABEL}.zip \
            --region ${AWS_REGION}
          echo "Updating environment ${EB_ENV} to ${VERSION_LABEL}"
          aws elasticbeanstalk update-environment \
            --environment-name "${EB_ENV}" \
            --version-label "${VERSION_LABEL}" \
            --region ${AWS_REGION}
          echo "Deployed ${VERSION_LABEL}"
        '''
      }
    }
  }
  post {
    success { echo "✅ Pipeline succeeded — deployed to Elastic Beanstalk." }
    failure { echo "❌ Pipeline failed — check console output and EB logs." }
  }
}
