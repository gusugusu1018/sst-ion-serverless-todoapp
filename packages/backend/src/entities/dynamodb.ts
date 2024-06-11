import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { type EntityConfiguration } from 'electrodb';
import { Resource } from 'sst';

export const Client = new DynamoDBClient({});

export const entityConfig: EntityConfiguration = {
  table: Resource.Table.name,
  client: Client,
};
