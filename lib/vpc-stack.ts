import { Stack, StackProps } from 'aws-cdk-lib';
import { Vpc,  SecurityGroup, Peer, Port } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class VpcStack extends Stack {
  public readonly vpc: Vpc;
  public readonly securityGroup: SecurityGroup;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    /**
     * VPC Instance Creation
     * 
     * 6 Subnets (3 Public, 3 Private)
     * Internet Gateway
     * No NAT Gateways / Elastic IPs
     */
    this.vpc = new Vpc(this, 'PortfolioVpc', {
      vpcName: 'Portfolio Machine VPC',
      // Do Not Create NAT Gateways
      natGateways: 0,

      // Create Internet Gateway
      createInternetGateway: true,
    });

    /**
     * EC2 Security Group Creation
     * 
     * Allow all inbound HTTP/HTTPS traffic
     * Allow all outbound traffic
     * Allow SSH access from anywhere
     */
    const securityGroup = new SecurityGroup(this, 'VpcSecurityGroup', {
      vpc: this.vpc,
      allowAllOutbound: true,
      description: 'Allow all inbound HTTP/HTTPS traffic',
      securityGroupName: 'Portfolio Machine Security Group',
    });    
    securityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(22), 'Allow SSH access from anywhere');
    securityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(80), 'Allow HTTP access from anywhere');
    securityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(443), 'Allow HTTPS access from anywhere');
  }
}