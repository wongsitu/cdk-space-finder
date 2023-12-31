import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const updateSpace = async (event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> => {
  if (event.queryStringParameters && ('id' in event.queryStringParameters) && event.body ) {
    const parsedBody = JSON.parse(event.body)
    const spaceId = event.queryStringParameters.id;
    const resquestBodyKey = Object.keys(parsedBody)[0];
    const requestBodyValue = parsedBody[resquestBodyKey];

    const updateResult = await ddbClient.send(new UpdateItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: marshall({
        id: spaceId
      }),
      UpdateExpression: `set #zzzNew = :new`,
      ExpressionAttributeValues: {
        ':new': { S: requestBodyValue }
      },
      ExpressionAttributeNames:{
        "#zzzNew": resquestBodyKey
      },
      ReturnValues:"UPDATED_NEW"
    }))

    return {
      statusCode: 204,
      body: JSON.stringify(updateResult.Attributes)
    }
  }
  
  return {
    statusCode: 400,
    body: JSON.stringify('Please provide right arguments')
  }
}