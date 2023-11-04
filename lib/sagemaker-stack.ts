import * as cdk from 'aws-cdk-lib';
import * as sagemaker from 'aws-cdk-lib/aws-sagemaker';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';

import { Construct } from 'constructs';

export class SageMakerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * IAM Role for SageMaker Notebook Instance
     */
    const sagemakerRole = new iam.Role(this, 'SageMakerRole', {
      assumedBy: new iam.ServicePrincipal('sagemaker.amazonaws.com'),
      roleName: 'SageMakerRole',
    });

    /**
     * SageMaker Notebook Instance for E-Score Notebook
     * Type: ml.t2.medium
     * Storage: 10GB
     * Internet Access: Enabled
     * Root Access: Enabled
     * Default Code Repository: e-score GitHub repository
     */
    const eScoreNotebook = new sagemaker.CfnNotebookInstance(this, 'eScoreNotebook', {
      instanceType: 'ml.t2.medium',
      roleArn: sagemakerRole.roleArn,
      defaultCodeRepository: 'https://github.com/rgavigan/e-score.git',
      notebookInstanceName: 'eScoreNotebook',
      rootAccess: 'Enabled',
      volumeSizeInGb: 10,
      directInternetAccess: 'Enabled',
    });
  }
}