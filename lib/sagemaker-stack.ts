import * as cdk from 'aws-cdk-lib';
import * as sagemaker from 'aws-cdk-lib/aws-sagemaker';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

import { Construct } from 'constructs';
import { awsAccount, eScoreShellScript } from '../constants';

export class SageMakerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * Get VPC from Ec2Stack
     */
    const vpc = ec2.Vpc.fromLookup(this, 'VPC', {
      vpcName: 'Portfolio Machine VPC',
    });

    /**
     * IAM Role for SageMaker Notebook Instance
     */
    const sagemakerRole = new iam.Role(this, 'SageMakerRole', {
      assumedBy: new iam.ServicePrincipal('sagemaker.amazonaws.com'),
      roleName: 'SageMakerRole',
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSageMakerFullAccess'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryFullAccess'),
      ],
    });

    /**
     * Lifestyle Config for E-Score SageMaker Notebook Instance
     */
    const eScoreLifecycleConfig = new sagemaker.CfnNotebookInstanceLifecycleConfig(this, 'eScoreLifecycleConfig', {
      notebookInstanceLifecycleConfigName: 'eScoreLifecycleConfig',
      // Run e-score shell script on notebook instance creation
      onCreate: [{
        content: Buffer.from(eScoreShellScript).toString('base64'),
      }]
    });

    /**
     * SageMaker Domain for ML Environments
     */
    const sagemakerDomain = new sagemaker.CfnDomain(this, 'sagemakerDomain', {
      authMode: 'IAM',
      domainName: 'mySageMakerDomain',
      defaultUserSettings: {
        executionRole: sagemakerRole.roleArn,
      },
      subnetIds: [
        vpc.publicSubnets[0].subnetId,
        vpc.publicSubnets[1].subnetId,
      ],
      vpcId: vpc.vpcId,
      defaultSpaceSettings: {
        executionRole: sagemakerRole.roleArn,
        kernelGatewayAppSettings: {
          defaultResourceSpec: {
            instanceType: 'ml.g4dn.2xlarge'
          },
        },
      }
    });

    /**
     * User Profile for SageMaker Domain
     */
    const sagemakerUserProfile = new sagemaker.CfnUserProfile(this, 'sagemakerUserProfile', {
      domainId: sagemakerDomain.ref,
      userSettings: {
        executionRole: sagemakerRole.roleArn,
      },
      userProfileName: 'Riley',
    });
  }
}