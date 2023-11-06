import { Stack, RemovalPolicy, StackProps } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Table, AttributeType } from 'aws-cdk-lib/aws-dynamodb';
import { User, ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class VictoryBulldogsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    /**
     * S3 Bucket to store Victory Bulldogs images
     */
    const victoryBulldogsBucket = new Bucket(this, 'VictoryBulldogsBucket', {
        bucketName: 'victorybulldogs',

        // Images should be publicly visible from website
        publicReadAccess: true,
        removalPolicy: RemovalPolicy.DESTROY,

        blockPublicAccess: {
          blockPublicAcls: false,
          blockPublicPolicy: false,
          ignorePublicAcls: false,
          restrictPublicBuckets: false,
        }
    });


    /**
     * DynamoDB Table to store Victory Bulldogs data
     * Schema:
     * - id: string (unique identifier)
     * - status: string (sold, available, reserved)
     * - dogName: string
     * - price: number (in CAD)
     * - description: string
     * - images: string[] (array of image URLs)
     */
    const victoryBulldogsTable = new Table(this, 'VictoryBulldogsTable', {
        tableName: 'victorybulldogs',
        partitionKey: {
            name: 'id',
            type: AttributeType.STRING,
        },
        removalPolicy: RemovalPolicy.DESTROY,
    });

    /**
     * Victory Bulldogs IAM User for Website to access S3 Bucket and DynamoDB Table
     */
    const victoryBulldogsUser = new User(this, 'VictoryBulldogsUser', {
        userName: 'victorybulldogs',
        managedPolicies: [
            ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'),
            ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'),
        ]
    });
  }
}