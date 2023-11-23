import { APIGatewayProxyEvent } from "aws-lambda";
import { JSONError } from "./Validators";

export function parseJSON<T>(json: string): T {
  try {
    return JSON.parse(json);
  } catch (e: any) {
    throw new JSONError(e.message);
  }
}

export function hasAdminGroup(event: APIGatewayProxyEvent) {
  const groups = event.requestContext.authorizer?.claims['cognito:groups']
  
  if (!groups) {
    return false
  }

  return (groups as string).includes('admins')
}