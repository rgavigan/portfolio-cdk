import { SageMakerStack } from '../lib/sagemaker-stack';
import { VpcStack } from '../lib/vpc-stack';
import { Template } from 'aws-cdk-lib/assertions';
import { App } from 'aws-cdk-lib';
import { awsAccount } from '../constants';

test('SageMaker Domain is is created properly', () => {
    const app = new App();

    // Create VpcStack
    const vpcStack = new VpcStack(app, 'VpcStack', {
      env: awsAccount,
    });
    
    // Create SageMakerStack
    const stack = new SageMakerStack(app, 'TestStack', {
      env: awsAccount,
      vpc: vpcStack.vpc,
    });
  
    // Prepare stack for assertions
    const template = Template.fromStack(stack);
  
    // Assert that the Sagemaker Domain is created with the correct properties
    console.dir(template.findResources('AWS::SageMaker::Domain').sagemakerDomain.Properties.VpcId);
    template.hasResourceProperties('AWS::SageMaker::Domain', {
      DomainName: 'mySageMakerDomain',
      AuthMode: 'IAM',
      VpcId: {
        'Fn::ImportValue': 'VpcStack:ExportsOutputRefPortfolioVpc1B20BE009842BDD3'
      },
      DefaultSpaceSettings: {
        KernelGatewayAppSettings: {
          DefaultResourceSpec: {
            InstanceType: 'ml.g4dn.2xlarge',
          },
        },
      }
    });
  
    // Assert that the User Profile is created with the correct properties
    template.hasResourceProperties('AWS::SageMaker::UserProfile', {
      DomainId: {
        Ref: 'sagemakerDomain',
      },
      UserProfileName: 'Riley',
    });
  
    // Assert that the Lifecycle Config is created with the correct properties
    template.hasResourceProperties('AWS::SageMaker::NotebookInstanceLifecycleConfig', {
      NotebookInstanceLifecycleConfigName: 'eScoreLifecycleConfig',
    });
  });