import { Stack, StackProps } from 'aws-cdk-lib';
import {
  CfnNotebookInstanceLifecycleConfig,
  CfnDomain,
  CfnUserProfile,
} from 'aws-cdk-lib/aws-sagemaker';
import { ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { eScoreShellScript } from '../constants';

interface SageMakerStackProps extends StackProps {
  vpc: Vpc;
}

export class SageMakerStack extends Stack {
  constructor(scope: Construct, id: string, props: SageMakerStackProps) {
    super(scope, id, props);

    /**
     * IAM Role for SageMaker Notebook Instance
     */
    const sagemakerRole = new Role(this, 'SageMakerRole', {
      assumedBy: new ServicePrincipal('sagemaker.amazonaws.com'),
      roleName: 'SageMakerRole',
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('AmazonSageMakerFullAccess'),
        ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'),
        ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryFullAccess'),
      ],
    });

    /**
     * Lifestyle Config for E-Score SageMaker Notebook Instance
     */
    const eScoreLifecycleConfig = new CfnNotebookInstanceLifecycleConfig(this, 'eScoreLifecycleConfig', {
      notebookInstanceLifecycleConfigName: 'eScoreLifecycleConfig',
      // Run e-score shell script on notebook instance creation
      onCreate: [{
        content: Buffer.from(eScoreShellScript).toString('base64'),
      }]
    });

    /**
     * SageMaker Domain for ML Environments
     */
    const sagemakerDomain = new CfnDomain(this, 'sagemakerDomain', {
      authMode: 'IAM',
      domainName: 'mySageMakerDomain',
      defaultUserSettings: {
        executionRole: sagemakerRole.roleArn,
      },
      subnetIds: [
        props.vpc.publicSubnets[0].subnetId,
      ],
      vpcId: props.vpc.vpcId,
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
    const sagemakerUserProfile = new CfnUserProfile(this, 'sagemakerUserProfile', {
      domainId: sagemakerDomain.ref,
      userSettings: {
        executionRole: sagemakerRole.roleArn,
      },
      userProfileName: 'Riley',
    });
  }
}