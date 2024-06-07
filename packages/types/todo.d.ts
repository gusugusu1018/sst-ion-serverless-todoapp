export interface Todo {
  // userId: jwt sub
  // dynamodb: pk, gsi1pk
  userId: string;
  // taskId: uuid
  // dynamodb: sk
  taskId: string;
  // createdAt: Date.now()
  // dynamodb: gsi1sk
  createdAt: number;
  title: string;
  completed: boolean;
}

export type CreateTodoRequest = Omit<
  Todo,
  'userId' | 'taskId' | 'createdAt' | 'completed'
>;

export type UpdateTodoRequest = Omit<Todo, 'userId' | 'createdAt' | 'title'>;