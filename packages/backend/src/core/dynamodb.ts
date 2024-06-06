import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DeleteCommand,
  DeleteCommandInput,
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
  PutCommand,
  PutCommandInput,
  QueryCommand,
  QueryCommandInput,
  UpdateCommand,
  UpdateCommandInput,
} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient();
const ddbDocClient = DynamoDBDocumentClient.from(client);

export default {
  get: (params: GetCommandInput) => ddbDocClient.send(new GetCommand(params)),
  put: (params: PutCommandInput) => ddbDocClient.send(new PutCommand(params)),
  query: (params: QueryCommandInput) => ddbDocClient.send(new QueryCommand(params)),
  update: (params: UpdateCommandInput) => {
    // Create a new UpdateCommand instance with ReturnValues set to 'ALL_NEW'
    const command = new UpdateCommand({
      ...params,
      ReturnValues: 'ALL_NEW',
    });
    return ddbDocClient.send(command);
  },
  delete: (params: DeleteCommandInput) => ddbDocClient.send(new DeleteCommand(params)),
};
