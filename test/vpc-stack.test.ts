import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { ResourceType } from 'aws-cdk-lib/aws-config';
import { awsAccount } from '../constants';
import { VpcStack } from '../lib/vpc-stack';

test('VPC instance is created properly', () => {
    const app = new App();
  
    const stack = new VpcStack(app, 'VpcStack', { env: awsAccount });
  
    // Prepare stack for assertions
    const template = Template.fromStack(stack);
  
    // Assert that a VPC instance is created
    template.resourceCountIs(ResourceType.EC2_VPC.complianceResourceType, 1)
  
    // Assert that the VPC instance is created with the correct properties
    template.hasResourceProperties(ResourceType.EC2_VPC.complianceResourceType, {
      // Asserts that the name of the VPC is Portfolio Machine VPC
      Tags: [
        {
          Key: 'Name',
          Value: 'Portfolio Machine VPC'
        }
      ]
    });
  
    // Assert that 6 subnets are created
    template.resourceCountIs(ResourceType.EC2_SUBNET.complianceResourceType, 6)
  });