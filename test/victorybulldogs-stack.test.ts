import { App } from 'aws-cdk-lib';
import { VictoryBulldogsStack } from '../lib/victorybulldogs-stack';
import { Template } from 'aws-cdk-lib/assertions';
import { ResourceType } from 'aws-cdk-lib/aws-config';
import { awsAccount } from '../constants';

test('Victory Bulldogs S3 Bucket is created properly', () => {
  const app = new App();
  
  // Create VictoryBulldogsStack
  const stack = new VictoryBulldogsStack(app, 'TestVictoryBulldogs', {
    env: awsAccount,
  });

  // Prepare stack for assertions
  const template = Template.fromStack(stack);

  // Assert that S3 Bucket is created
  template.resourceCountIs(ResourceType.S3_BUCKET.complianceResourceType, 1)
  console.dir(template.findResources(ResourceType.S3_BUCKET.complianceResourceType));

  // Assert that S3 Bucket has public read access
  template.hasResourceProperties(ResourceType.S3_BUCKET.complianceResourceType, {
      BucketName: 'victorybulldogs',
  });
});

test('Victory Bulldogs DynamoDB Table is created properly', () => {
    const app = new App();
    
    // Create VictoryBulldogsStack
    const stack = new VictoryBulldogsStack(app, 'TestVictoryBulldogs', {
      env: awsAccount,
    });
  
    // Prepare stack for assertions
    const template = Template.fromStack(stack);
  
    // Assert that DynamoDB Table is created
    template.resourceCountIs(ResourceType.DYNAMODB_TABLE.complianceResourceType, 1)

    // Assert that DynamoDB Table has the correct properties
    template.hasResourceProperties(ResourceType.DYNAMODB_TABLE.complianceResourceType, {
        TableName: 'victorybulldogs',
        KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH'
            }
        ],
        AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S'
            }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
        }
    });
  });