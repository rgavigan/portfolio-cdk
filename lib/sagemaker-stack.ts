import * as cdk from 'aws-cdk-lib';
import * as sagemaker from 'aws-cdk-lib/aws-sagemaker';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

import { Construct } from 'constructs';

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
     * DISABLED - Working with Studio Instead (Keeping For Reference)
     * SageMaker Notebook Instance for E-Score Notebook
     * Type: ml.t2.medium
     * Storage: 10GB
     * Internet Access: Enabled
     * Root Access: Enabled
     * Default Code Repository: e-score GitHub repository
     */
    // const eScoreNotebook = new sagemaker.CfnNotebookInstance(this, 'eScoreNotebook', {
    //   instanceType: 'ml.t2.medium',
    //   roleArn: sagemakerRole.roleArn,
    //   defaultCodeRepository: 'https://github.com/rgavigan/e-score.git',
    //   notebookInstanceName: 'eScoreNotebook',
    //   rootAccess: 'Enabled',
    //   volumeSizeInGb: 10,
    //   directInternetAccess: 'Enabled',
    // });

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