import { App } from 'aws-cdk-lib';
import { Ec2Stack } from '../lib/ec2-stack';
import { SageMakerStack } from '../lib/sagemaker-stack';
import { Template, Match } from 'aws-cdk-lib/assertions';
import { ResourceType } from 'aws-cdk-lib/aws-config';
import { awsAccount } from '../constants';

test('VPC instance is created', () => {
  const app = new App();
  
  // Create Ec2Stack
  const stack = new Ec2Stack(app, 'TestStack', {
    env: awsAccount,
  });

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

test('EC2 instance is created', () => {
  const app = new App();
  
  // Create Ec2Stack
  const stack = new Ec2Stack(app, 'TestStack', {
    env: { account: '939499127636', region: 'us-east-1' },
  });

  // Prepare stack for assertions
  const template = Template.fromStack(stack);

  // Assert that an EC2 instance is created
  template.resourceCountIs(ResourceType.EC2_INSTANCE.complianceResourceType, 1)

  // Assert that the EC2 instance is created with the correct properties
  template.hasResourceProperties(ResourceType.EC2_INSTANCE.complianceResourceType, {
    InstanceType: 't2.micro',
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
    InstanceType: 't3.micro', // Not t2.micro, Match.not() will pass
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

test('SageMaker Notebook is Created', () => {
  const app = new App();
  
  // Create SageMakerStack
  const stack = new SageMakerStack(app, 'TestStack', {
    env: awsAccount,
  });

  // Prepare stack for assertions
  const template = Template.fromStack(stack);

  // Assert that a SageMaker Notebook instance is created
  template.resourceCountIs(ResourceType.SAGEMAKER_NOTEBOOK_INSTANCE.complianceResourceType, 1)

  // Assert that the SageMaker Notebook instance is created with the correct properties
  template.hasResourceProperties(ResourceType.SAGEMAKER_NOTEBOOK_INSTANCE.complianceResourceType, {
    InstanceType: 'ml.t2.medium',
    DefaultCodeRepository: 'https://github.com/rgavigan/e-score.git',
  });
});