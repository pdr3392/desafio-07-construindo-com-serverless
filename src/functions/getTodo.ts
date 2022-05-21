import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamoClient";

export const handler: APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters;

  const response = await document
    .query({
      TableName: "todos",
      KeyConditionExpression: "user_id = :user_id",
      ExpressionAttributeValues: {
        ":user_id": String(user_id),
      },
    })
    .promise();

  const todos = response.Items;

  if (todos.length > 0) {
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "TO DOs válidos",
        todos: todos,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "TO DOs não encontrados",
    }),
  };
};
