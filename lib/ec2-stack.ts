import { Stack, StackProps } from 'aws-cdk-lib';
import { 
  Instance, 
  InstanceType, 
  AmazonLinux2023ImageSsmParameter,
  BlockDeviceVolume,
  UserData,
  SubnetType,
  Vpc,
  SecurityGroup
} from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { userData } from '../constants';

// Create EC2 Props
interface Ec2StackProps extends StackProps {
  vpc: Vpc;
  securityGroup: SecurityGroup;
}

export class Ec2Stack extends Stack {
  constructor(scope: Construct, id: string, props: Ec2StackProps) {
    super(scope, id, props);

    /** 
     * EC2 Instance Creation
     * 
     * Type: t3.2xlarge (Initially - downgrade to t3.micro after user data script runs)
     * Storage: 30GiB EBS
     * IOs: 2 million
     * Snapshots: 1GB
     * Internet Bandwidth: 100GB
     */
    new Instance(this, 'Portfolio Machine', {
      vpc: props.vpc,
      instanceType: new InstanceType('t3.2xlarge'),
      machineImage: new AmazonLinux2023ImageSsmParameter(),
      blockDevices: [
        {
          deviceName: '/dev/xvda', // Root disk
          volume: BlockDeviceVolume.ebs(30, {
            encrypted: true,
          }),
        },
      ],
      keyName: 'portfolio_machine',
      securityGroup: props.securityGroup,
      instanceName: 'Portfolio Machine',
      associatePublicIpAddress: true,
      // Place in Public Subnets
      vpcSubnets: {
        subnetType: SubnetType.PUBLIC,
      },
      // User data script to install all dependencies and run Chess application and web server
      userData: UserData.custom(userData),
    });
  }
}