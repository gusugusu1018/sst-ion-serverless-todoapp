import { Entity, type EntityItem } from 'electrodb';

import { entityConfig } from '../core/dynamodb';

export const TaskEntity = new Entity(
  {
    model: {
      version: '1',
      entity: 'Task',
      service: 'todoapp',
    },
    attributes: {
      userId: {
        type: 'string',
        required: true,
      },
      taskId: {
        type: 'string',
        required: true,
      },
      createdAt: {
        type: 'string',
        required: true,
      },
      title: {
        type: 'string',
        required: true,
      },
      completed: {
        type: 'boolean',
        required: true,
        default: false,
      },
    },
    indexes: {
      task: {
        pk: {
          field: 'pk',
          composite: ['userId'],
        },
        sk: {
          field: 'sk',
          composite: ['taskId'],
        },
      },
      tasks: {
        index: 'lsi1pk-lsi1sk-index',
        pk: {
          field: 'pk',
          composite: ['userId'],
        },
        sk: {
          field: 'lsi1sk',
          composite: ['createdAt'],
        },
      },
    },
  },
  entityConfig,
);

export type TaskEntityType = EntityItem<typeof TaskEntity>;
