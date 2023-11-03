#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PortfolioCdkStack } from '../lib/portfolio-cdk-stack';

const envUS = { account: '939499127636', region: 'us-east-1' };

const app = new cdk.App();
new PortfolioCdkStack(app, 'PortfolioCdkStack', { env: envUS });