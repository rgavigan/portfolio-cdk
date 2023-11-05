#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { VpcStack } from '../lib/vpc-stack';
import { Ec2Stack } from '../lib/ec2-stack';
import { SageMakerStack } from '../lib/sagemaker-stack';
import { VictoryBulldogsStack } from '../lib/victorybulldogs-stack';
import { awsAccount } from '../constants';

// App Creation
const app = new App();

// VPC Stack Creation
const vpcStack = new VpcStack(app, 'VpcStack', { env: awsAccount });

// EC2 Stack Creation
const ec2Stack = new Ec2Stack(app, 'Ec2Stack', { 
    env: awsAccount,
    vpc: vpcStack.vpc,
    securityGroup: vpcStack.securityGroup,
});

// SageMaker Stack Creation
const sageMakerStack = new SageMakerStack(app, 'SageMakerStack', { 
    env: awsAccount,
    vpc: vpcStack.vpc,
});

// Victory Bulldogs Stack Creation
const victoryBulldogsStack = new VictoryBulldogsStack(app, 'VictoryBulldogsStack', { 
    env: awsAccount 
});