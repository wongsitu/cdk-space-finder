import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { postSpaces } from "./PostSpaces";
import { getSpaces } from "./GetSpaces";
import { updateSpace } from "./UpdateSpace";
import { deleteSpace } from "./DeleteSpace";

const ddbClient = new DynamoDBClient({});

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult>{
  try {
    switch (event.httpMethod) {
      case 'GET':
        const getResponse = await getSpaces(event, ddbClient);
        return getResponse
      case 'POST':
        const postResponse = await postSpaces(event, ddbClient);
        return postResponse
      case 'PUT':
        const putResponse = await updateSpace(event, ddbClient);
        return putResponse
      case 'DELETE':
        const deleteResponse = await deleteSpace(event, ddbClient);
        return deleteResponse
      default:
        break;
    }
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify(error.message)
    };
  }
  
  return {
    statusCode: 422,
    body: 'Unprocessable Entity'
  };
}

export { handler };