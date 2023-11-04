import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { userData } from '../constants';

export class Ec2Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * VPC Instance
     */
    const vpc = new ec2.Vpc(this, 'PortfolioVpc', {
      vpcName: 'Portfolio Machine VPC',
    });

    /**
     * EC2 Security Group - SSH, HTTP, and HTTPS
     */
    const securityGroup = new ec2.SecurityGroup(this, 'VpcSecurityGroup', {
      vpc: vpc,
      allowAllOutbound: true,
      description: 'Allow all inbound HTTP/HTTPS traffic',
      securityGroupName: 'Portfolio Machine Security Group',
    });    
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'Allow SSH access from anywhere');
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Allow HTTP access from anywhere');
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), 'Allow HTTPS access from anywhere');

    /** 
     * EC2 Instance - Free Tier (https://aws.amazon.com/free)
     * Type: t2.micro
     * Storage: 30GiB EBS
     * IOs: 2 million
     * Snapshots: 1GB
     * Internet Bandwidth: 100GB
     */
    new ec2.Instance(this, 'Portfolio Machine', {
      vpc: vpc,
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: new ec2.AmazonLinux2023ImageSsmParameter(),
      blockDevices: [
        {
          deviceName: '/dev/xvda', // Root disk
          volume: ec2.BlockDeviceVolume.ebs(8, {
            encrypted: true,
          }),
        },
        {
          deviceName: '/dev/sdb', // Additional EBS disk
          volume: ec2.BlockDeviceVolume.ebs(22, {
            encrypted: true,
          }),
        },
      ],
      keyName: 'portfolio_machine',
      securityGroup: securityGroup,
      instanceName: 'Portfolio Machine',
      associatePublicIpAddress: true,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      // User data script to install all dependencies and run Chess application and web server
      userData: ec2.UserData.custom(userData),
    });
  }
}