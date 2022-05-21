import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "ignite-todo",
  frameworkVersion: "3",
  plugins: [
    "serverless-esbuild",
    "serverless-dynamodb-local",
    "serverless-offline",
  ],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    region: "us-east-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["dynamodb:*"],
        Resource: ["*"],
      },
      {
        Effect: "Allow",
        Action: ["s3:*"],
        Resource: ["*"],
      },
    ],
  },
  functions: {
    addTodo: {
      handler: "src/functions/addTodo.handler",
      events: [
        {
          http: {
            path: "add_todo/{id}",
            method: "post",
            cors: true,
          },
        },
      ],
    },

    getTodo: {
      handler: "src/functions/getTodo.handler",
      events: [
        {
          http: {
            path: "get_todo/{user_id}",
            method: "get",
            cors: true,
          },
        },
      ],
    },
  },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
      external: ["chrome-aws-lambda"],
    },
    dynamodb: {
      stages: ["dev", "local"],
      start: {
        port: 8000,
        inMemory: true,
        migrate: true,
      },
    },
  },
  resources: {
    Resources: {
      dbCertificateUsers: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "todos",
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
          AttributeDefinitions: [
            {
              AttributeName: "id",
              AttributeType: "S",
            },
            {
              AttributeName: "user_id",
              AttributeType: "S",
            },
          ],
          KeySchema: [
            {
              AttributeName: "user_id",
              KeyType: "HASH",
            },
            {
              AttributeName: "id",
              KeyType: "RANGE",
            },
          ],
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
