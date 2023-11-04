## My Portfolio AWS Resource Management Via CDK

### Resources
* EC2 Instance
    * Runs my Chess Application
* SageMaker Notebook
    * Runs my e-score repository for analysis

### Building and Deploying
```sh
npm run build && npm run test
cdk deploy
```

## Prerequisite - Download AWS CLI
* [Download AWS CLI](https://aws.amazon.com/cli/)
* Download AWS CDK Toolkit - `npm install -g aws-cdk`