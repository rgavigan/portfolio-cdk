#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Ec2Stack } from '../lib/ec2-stack';
import { SageMakerStack } from '../lib/sagemaker-stack';
import { awsAccount } from '../constants';

// App Creation
const app = new cdk.App();

// EC2 Stack Creation
new Ec2Stack(app, 'PortfolioCdkStack', { env: awsAccount });

// SageMaker Stack Creation
new SageMakerStack(app, 'SageMakerStack', { env: awsAccount });