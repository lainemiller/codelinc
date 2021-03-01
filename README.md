# codelinc

This project contains source code and supporting files for a serverless application that you can deploy with the AWS codePipeline  It includes the following files and folders.

- hello-world - Code for the application's Lambda function.
- events - Invocation events that you can use to invoke the function.
- hello-world/tests - Unit tests for the application code.
- template.yaml - A template that defines the application's AWS resources.

## Deploy the sample application

To build and deploy your application for the first time, run the following in your shell:

create servantCenterLambdaRole and attach three Policies
- servantCenterCognitoAccess
- servantCenterDynamodbAccess
- servantCenterS3Access
create servantCenterCloudFormationRole and attach following Policies
- AWSLambdaExecute
- servantCenterCFlambdaPipelinePolicy
