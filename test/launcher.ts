import { handler } from "../src/services/spaces/handler";

// handler({
//   httpMethod: 'POST',
//   body: JSON.stringify({
//     location: 'London'
//   })
// } as any, {} as any)

process.env.AWS_REGION = 'us-west-2'
process.env.TABLE_NAME = 'SpaceTable-0a7ef3994923'

// handler({
//   httpMethod: 'POST',
//   body: JSON.stringify({
//     name: 'hello description',
//     location: 'Calgary'
//   })
// } as any, {} as any)

// handler({ 
//   httpMethod: 'GET',
// } as any, {} as any)

handler({ 
  httpMethod: 'GET', 
  queryStringParameters: {
    id: '50426683-8c2b-4e99-8a07-9842ca77739a'
  },
} as any, {} as any)

// handler({ 
//   httpMethod: 'PUT', 
//   queryStringParameters: {
//     id: '455079b1-bdb4-4378-860c-2cbd19a94101'
//   },
//   body: JSON.stringify({
//     location: 'Dublin'
//   })
// } as any, {} as any)

// handler({ 
//   httpMethod: 'DELETE', 
//   queryStringParameters: {
//     id: '455079b1-bdb4-4378-860c-2cbd19a94101'
//   },
// } as any, {} as any)