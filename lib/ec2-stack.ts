import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { userData } from '../constants';

export class Ec2Stack extends cdk.Stack {
  // Export  VPC instance
  public vpc: ec2.Vpc;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /**
     * VPC Instance
     */
    this.vpc = new ec2.Vpc(this, 'PortfolioVpc', {
      vpcName: 'Portfolio Machine VPC',
    });

    /**
     * EC2 Security Group - SSH, HTTP, and HTTPS
     */
    const securityGroup = new ec2.SecurityGroup(this, 'VpcSecurityGroup', {
      vpc: this.vpc,
      allowAllOutbound: true,
      description: 'Allow all inbound HTTP/HTTPS traffic',
      securityGroupName: 'Portfolio Machine Security Group',
    });    
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'Allow SSH access from anywhere');
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Allow HTTP access from anywhere');
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), 'Allow HTTPS access from anywhere');

    /** 
     * EC2 Instance
     * Type: t3.2xlarge (For initial boot, will downgrade to t3.micro)
     * Storage: 30GiB EBS
     * IOs: 2 million
     * Snapshots: 1GB
     * Internet Bandwidth: 100GB
     */
    new ec2.Instance(this, 'Portfolio Machine', {
      vpc: this.vpc,
      instanceType: new ec2.InstanceType('t3.2xlarge'),
      machineImage: new ec2.AmazonLinux2023ImageSsmParameter(),
      blockDevices: [
        {
          deviceName: '/dev/xvda', // Root disk
          volume: ec2.BlockDeviceVolume.ebs(30, {
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