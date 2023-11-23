import { type CognitoUser } from '@aws-amplify/auth';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import { Amplify, Auth } from 'aws-amplify';
import { AuthStack } from '../outputs.json';

require('dotenv').config()

Amplify.configure({
    Auth: {
        region: process.env.AWS_REGION,
        userPoolId: AuthStack.SpaceUserPoolId,
        userPoolWebClientId: AuthStack.SpaceUserPoolClient,
        identityPoolId: AuthStack.SpaceIdentityPoolId,
        authenticationFlowType: 'USER_PASSWORD_AUTH'
    }
});

export class AuthService {
    public async login(userName: string, password: string) {
        const result = await Auth.signIn(userName, password) as CognitoUser;
        return result;
    }

    public async generateTemporaryCredentials(cognitoUser: CognitoUser) {
        const jwtToken = cognitoUser.getSignInUserSession()?.getIdToken().getJwtToken()!;
        const cognitoIdentityPool = `cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${AuthStack.SpaceUserPoolId}`;
        const cognitoIdentity = new CognitoIdentityClient({
            credentials: fromCognitoIdentityPool({
                identityPoolId: AuthStack.SpaceIdentityPoolId,
                logins: {
                    [cognitoIdentityPool]: jwtToken
                }
            })
        }); 
        const credentials = await cognitoIdentity.config.credentials();     
        return credentials                                 
    }
}