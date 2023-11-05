## Portfolio AWS Resource Management via CDK

### Building and Deploying
```sh
# Make sure AWS is configured
aws configure

# Build and run unit tests
npm run build && npm run test

# If necessary, bootstrap prior to deployment
cdk bootstrap

cdk deploy --all
```

## Prerequisite - Download AWS CLI
* [Download AWS CLI](https://aws.amazon.com/cli/)
* Download AWS CDK Toolkit - `npm install -g aws-cdk`