export const table = new sst.aws.Dynamo('TaskTable', {
  fields: {
    userId: 'string',
    taskId: 'string',
    createdAt: 'number',
  },
  primaryIndex: { hashKey: 'userId', rangeKey: 'taskId' },
  globalIndexes: {
    CreatedAtIndex: { hashKey: 'userId', rangeKey: 'createdAt' },
  },
});
