import { DeleteItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const deleteSpace = async (event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> => {
  if (!event.queryStringParameters?.id) {
    return {
      statusCode: 422,
      body: 'Missing id'
    }
  }

  const spaceId = event.queryStringParameters.id;

  const deleteResult = await ddbClient.send(new DeleteItemCommand({
    TableName: process.env.TABLE_NAME,
    Key: marshall({
      id: spaceId
    }),
  }))

  return {
    statusCode: 200,
    body: JSON.stringify(deleteResult)
  }
}