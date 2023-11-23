import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3'
import { AuthService } from './AuthService'
require('dotenv').config()

async function testAuth(){
  console.log(process.env)
  const service = new AuthService()
  const loginResult = await service.login(process.env.USERNAME!, process.env.PASSWORD!)

  console.log(loginResult.getSignInUserSession()?.getIdToken().getJwtToken())
  const credentials = await service.generateTemporaryCredentials(loginResult)
  console.log(credentials)

  await listBuckets(credentials)
}

async function listBuckets(credentials: any){
  const client = new S3Client({
    credentials
  })

  const command = new ListBucketsCommand({})

  const result = await client.send(command)

  console.log(result)

  return result
}

testAuth()