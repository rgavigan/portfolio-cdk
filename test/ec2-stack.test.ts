import { App } from 'aws-cdk-lib';
import { Ec2Stack } from '../lib/ec2-stack';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { ResourceType } from 'aws-cdk-lib/aws-config';
import { awsAccount } from '../constants';
import { VpcStack } from '../lib/vpc-stack';

test('EC2 instance is created properly', () => {
  const app = new App();
  
  const vpcStack = new VpcStack(app, 'VpcStack', { env: awsAccount });
  
  // Create Ec2Stack
  const stack = new Ec2Stack(app, 'TestStack', {
    env: awsAccount,
    vpc: vpcStack.vpc,
    securityGroup: vpcStack.securityGroup,
  });

  // Prepare stack for assertions
  const template = Template.fromStack(stack);

  // Assert that an EC2 instance is created
  template.resourceCountIs(ResourceType.EC2_INSTANCE.complianceResourceType, 1)

  // Assert that the EC2 instance is created with the correct properties
  template.hasResourceProperties(ResourceType.EC2_INSTANCE.complianceResourceType, {
    InstanceType: 't3.2xlarge',
    KeyName: 'portfolio_machine',
    // Asserts that the instance has two block devices with a total of 30GB Storage
    BlockDeviceMappings: [
      {
        DeviceName: '/dev/xvda',
        Ebs: {
          VolumeSize: 30,
          Encrypted: true
        }
      }
    ],
    // Asserts that the name of the EC2 instance is Portfolio Machine
    Tags: [
      {
        Key: 'Name',
        Value: 'Portfolio Machine'
      }
    ],
    // Asserts that the instance has a public IP address
    NetworkInterfaces: [
      {
        AssociatePublicIpAddress: true
      }
    ]
  });

  // Assert that the EC2 instance is only created with the correct properties
  template.hasResourceProperties(ResourceType.EC2_INSTANCE.complianceResourceType, Match.not({
    InstanceType: 't3.micro',
    KeyName: 'portfolio_machine',
    // Asserts that the instance has two block devices with a total of 30GB Storage
    BlockDeviceMappings: [
      {
        DeviceName: '/dev/xvda',
        Ebs: {
          VolumeSize: 30,
          Encrypted: true
        }
      }
    ],
    // Asserts that the name of the EC2 instance is Portfolio Machine
    Tags: [
      {
        Key: 'Name',
        Value: 'Portfolio Machine'
      }
    ],
    // Asserts that the instance has a public IP address
    NetworkInterfaces: [
      {
        AssociatePublicIpAddress: true
      }
    ]
  }));
});