import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamoClient";
import { v4 as uuidv4 } from "uuid";

interface ITodoStored {
  id: string;
  user_id: string;
  title: string;
  done: boolean;
  deadline: string;
}

interface ITodoRequest {
  title: string;
  deadline: Date;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { deadline, title } = JSON.parse(event.body) as ITodoRequest;

  const id = uuidv4();

  const { id: user_id } = event.pathParameters;

  const todo: ITodoStored = {
    id: String(id),
    user_id,
    deadline: new Date(deadline).toISOString(),
    done: false,
    title,
  };

  await document
    .put({
      TableName: "todos",
      Item: todo,
    })
    .promise();

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: "To-Do armazenado com sucesso",
      todo: todo,
    }),
  };
};
