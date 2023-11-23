import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { postSpaces } from "./PostSpaces";
import { getSpaces } from "./GetSpaces";
import { updateSpace } from "./UpdateSpace";
import { deleteSpace } from "./DeleteSpace";
import { addCORSHeaders } from "./shared/Utils";

const ddbClient = new DynamoDBClient({});

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult>{
  let response: APIGatewayProxyResult | undefined
  
  try {
    switch (event.httpMethod) {
      case 'GET':
        const getResponse = await getSpaces(event, ddbClient);
        response = getResponse
        break
      case 'POST':
        const postResponse = await postSpaces(event, ddbClient);
        response = postResponse
        break
      case 'PUT':
        const updateResponse = await updateSpace(event, ddbClient);
        response = updateResponse
        break
      case 'DELETE':
        const deleteResponse = await deleteSpace(event, ddbClient);
        response = deleteResponse
        break
      default:
        response = {
          statusCode: 422,
          body: JSON.stringify('Unprocessable Entity')
        }
        break;
    }
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify(error.message)
    };
  }

  addCORSHeaders(response);
  return response;
}

export { handler };