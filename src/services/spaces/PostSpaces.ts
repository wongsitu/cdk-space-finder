import { z } from "zod";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { PostSchema } from "./shared/Validators";
import { marshall } from "@aws-sdk/util-dynamodb";

export const postSpaces = async (event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Missing body'
      })
    }
  }

  try {
    const item = PostSchema.parse(JSON.parse(event.body))

    const result  = await ddbClient.send(new PutItemCommand({
      TableName: process.env.TABLE_NAME,
      Item: marshall(item),
    }))

    return {
      statusCode: 200,
      body: JSON.stringify(marshall(result.Attributes))
    }

  } catch (err) {
    if (err instanceof z.ZodError) {
      console.log(err)
      return {
        statusCode: 200,
        body: JSON.stringify(err.issues)
      }
    }
  }

  return {
    statusCode: 200,
    body: ''
  }
}