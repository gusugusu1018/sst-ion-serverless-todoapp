import { Entity, type EntityItem } from 'electrodb';

import { entityConfig } from './dynamodb';

export const User = new Entity(
  {
    model: {
      version: '1',
      entity: 'User',
      service: 'todoapp',
    },
    attributes: {
      userId: {
        type: 'string',
        required: true,
      },
      email: {
        type: 'string',
        required: true,
      },
      name: {
        type: 'string',
        required: true,
      },
      createdAt: {
        type: 'string',
        required: true,
        default: () => `${new Date().toISOString()}`,
      },
    },
    indexes: {
      users: {
        pk: {
          field: 'pk',
          composite: ['userId'],
        },
        sk: {
          field: 'sk',
          composite: [],
        },
      },
    },
  },
  entityConfig,
);

export type UserEntity = EntityItem<typeof User>;
