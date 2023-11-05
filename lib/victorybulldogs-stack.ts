import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class VictoryBulldogsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * S3 Bucket to store Victory Bulldogs images
     */
    const victoryBulldogsBucket = new s3.Bucket(this, 'VictoryBulldogsBucket', {
        bucketName: 'victorybulldogs',

        // Images should be publicly visible from website
        publicReadAccess: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY,

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
    const victoryBulldogsTable = new dynamodb.Table(this, 'VictoryBulldogsTable', {
        tableName: 'victorybulldogs',
        partitionKey: {
            name: 'id',
            type: dynamodb.AttributeType.STRING,
        },
        removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
  }
}