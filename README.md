## Portfolio AWS Resource Management via CDK

### Building and Deploying
```sh
# Make sure AWS is configured
aws configure

npm install -g aws-cdk

# Build and run unit tests
npm install && npm run build && npm run test

# If necessary, bootstrap prior to deployment
cdk bootstrap

cdk deploy --all
```

### SSL Certificate Requirements
* Ensure the certificate is properly created or renewed and stored as desired in `/etc/nginx/conf.d/chess.conf`

```sh
sudo nginx -t # Should have no errors
sudo systemctl restart chess.rileygavigan.com # Ensure service is restarted and working with SSL
```
## Prerequisite - Download AWS CLI
* [Download AWS CLI](https://aws.amazon.com/cli/)