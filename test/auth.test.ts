import { AuthService } from './AuthService'
require('dotenv').config()

async function testAuth(){
  console.log(process.env)
  const service = new AuthService()
  const loginResult = await service.login(process.env.USERNAME!, process.env.PASSWORD!)

  console.log(loginResult.getSignInUserSession()?.getIdToken().getJwtToken())
  const credentials = await service.generateTemporaryCredentials(loginResult)
  console.log(credentials)
}

testAuth()