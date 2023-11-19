import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CreatePostSchema } from "./shared/Validators";
import { marshall } from "@aws-sdk/util-dynamodb";

export const postSpaces = async (event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> => {
  if (!event.body) {
    return {
      statusCode: 422,
      body: 'Unprocessable Entity'
    }
  }

  const item = CreatePostSchema.safeParse(JSON.parse(event.body))

  if (!item.success) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        success: item.success,
        errors: item.error.issues
      })
    }
  }

  await ddbClient.send(new PutItemCommand({
    TableName: process.env.TABLE_NAME,
    Item: marshall(item.data),
  }))

  return {
    statusCode: 200,
    body: JSON.stringify({ 
      success: item.success,
      data: item.data
    })
  }
}