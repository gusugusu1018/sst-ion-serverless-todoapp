export const table = new sst.aws.Dynamo('Table', {
  fields: {
    pk: 'string',
    sk: 'string',
    gsi1pk: 'string',
    gsi1sk: 'string',
    gsi2pk: 'string',
    gsi2sk: 'string',
  },
  primaryIndex: {
    hashKey: 'pk',
    rangeKey: 'sk',
  },
  globalIndexes: {
    'gsi1pk-gsi1sk-index': {
      hashKey: 'gsi1pk',
      rangeKey: 'gsi1sk',
    },
    'gsi2pk-gsi2sk-index': {
      hashKey: 'gsi2pk',
      rangeKey: 'gsi2sk',
    },
  },
});
