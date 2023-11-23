import { App } from "aws-cdk-lib";
import { DataStack } from "./stacks/Data.stacks";
import { LambdaStack } from "./stacks/LambdaStack";
import { ApiStack } from "./stacks/ApiStack";
import { AuthStack } from "./stacks/AuthStack";

const app = new App()
const dataStack = new DataStack(app, "DataStack")
const lambdaStack = new LambdaStack(app, "LambdaStack", {
  spacesTable: dataStack.spacesTable,
})
const auhtStack = new AuthStack(app, "AuthStack")
new ApiStack(app, "ApiStack", {
  spacesLambdaIntegration: lambdaStack.spacesLambdaIntegration,
  userPool: auhtStack.userPool,
})