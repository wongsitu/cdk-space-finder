import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib'
import { CfnIdentityPool, CfnIdentityPoolRoleAttachment, CfnUserPoolGroup, UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito'
import { Effect, FederatedPrincipal, PolicyStatement, Role } from 'aws-cdk-lib/aws-iam'
import { Construct } from 'constructs'

export class AuthStack extends Stack {
  public userPool: UserPool
  private userPoolClient: UserPoolClient
  private identityPool: CfnIdentityPool

  private authenticatedRole: Role
  private unAuthenticatedRole: Role
  private adminRole: Role

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    this.userPool = this.createUserPool()
    this.userPoolClient = this.createUserPoolClient()
    this.identityPool = this.createIdentityPool()
    const { adminRole, authenticatedRole, unAuthenticatedRole } = this.createRoles()

    this.authenticatedRole = authenticatedRole;
    this.unAuthenticatedRole = unAuthenticatedRole;
    this.adminRole = adminRole;

    this.createAdminGroup()
    this.attachRoles()
  }

  private createUserPool() {
    const userPool = new UserPool(this, 'SpaceUserPool', {
      selfSignUpEnabled: true,
      signInAliases:{
        username: true,
        email: true,
      }
    })

    new CfnOutput(this, 'SpaceUserPoolId', {
      value: userPool.userPoolId
    })

    return userPool
  }

  private createUserPoolClient() {
    const userPoolClient = this.userPool.addClient('SpaceUserPoolClient', {
      authFlows:{
        adminUserPassword: true,
        custom: true,
        userPassword: true,
        userSrp: true,
      }
    })

    new CfnOutput(this, 'SpaceUserPoolClient', {
      value: userPoolClient.userPoolClientId
    })

    return userPoolClient
  }

  private createAdminGroup(){
    new CfnUserPoolGroup(this, 'SpaceAdmins', {
      userPoolId: this.userPool.userPoolId,
      groupName: 'admins',
      roleArn: this.adminRole.roleArn,
    })
  }

  private createIdentityPool(){
    const identityPool = new CfnIdentityPool(this, 'SpaceIdentityPool', {
      allowUnauthenticatedIdentities: true,
      cognitoIdentityProviders: [{
        clientId: this.userPoolClient.userPoolClientId,
        providerName: this.userPool.userPoolProviderName,
      }]
    })

    new CfnOutput(this, 'SpaceIdentityPoolId', {
      value: identityPool.ref
    })

    return identityPool
  }

  private createRoles(){
    const authenticatedRole = new Role(this, 'CognitoDefaultAuthenticatedRole', {
      assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com',{
        StringEquals: {
          'cognito-identity.amazonaws.com:aud': this.identityPool.ref,
        },
        'ForAnyValue:StringLike': {
          'cognito-identity.amazonaws.com:amr': 'authenticated',
        },
      }, 'sts:AssumeRoleWithWebIdentity'),
    })

    const unAuthenticatedRole = new Role(this, 'CognitoDefaultUnauthenticatedRole', {
      assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com',{
        StringEquals: {
          'cognito-identity.amazonaws.com:aud': this.identityPool.ref,
        },
        'ForAnyValue:StringLike': {
          'cognito-identity.amazonaws.com:amr': 'unauthenticated',
        },
      }, 'sts:AssumeRoleWithWebIdentity'),
    })

    const adminRole = new Role(this, 'CognitoAdminRole', {
      assumedBy: new FederatedPrincipal('cognito-identity.amazonaws.com',{
        StringEquals: {
          'cognito-identity.amazonaws.com:aud': this.identityPool.ref,
        },
        'ForAnyValue:StringLike': {
          'cognito-identity.amazonaws.com:amr': 'authenticated',
        },
      }, 'sts:AssumeRoleWithWebIdentity'),
    })

    adminRole.addToPolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        's3:ListAllMyBucket',
      ],
      resources: ['*'],
    }))

    return {
      authenticatedRole,
      unAuthenticatedRole,
      adminRole,
    }
  }

  private attachRoles(){
    new CfnIdentityPoolRoleAttachment(this, 'IdentityPoolRoleAttachment', {
      identityPoolId: this.identityPool.ref,
      roles: {
        'authenticated': this.authenticatedRole.roleArn,
        'unauthenticated': this.unAuthenticatedRole.roleArn,
      },
      roleMappings: {
        'cognito-identity.amazonaws.com': {
          identityProvider: `${this.userPool.userPoolProviderName}:${this.userPoolClient.userPoolClientId}`,
          type: 'Token',
          ambiguousRoleResolution: 'AuthenticatedRole',
        }
      }
    })
  }
}