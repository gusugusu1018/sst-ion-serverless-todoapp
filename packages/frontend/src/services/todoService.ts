// services/todoService.ts
import {
  CreateTodoRequest,
  Todo,
  UpdateTodoRequest,
} from '@sst-ion-serverless-todoapp/types';
import { fetchAuthSession } from 'aws-amplify/auth';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

class TodoService {
  private async getAuthHeaders() {
    const { accessToken } = (await fetchAuthSession()).tokens ?? {};
    return {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
  }

  async getTodos(): Promise<Todo[]> {
    try {
      const response = await axios.get<Todo[]>(
        `${API_URL}/todos`,
        await this.getAuthHeaders(),
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching todos: ', error);
      throw error;
    }
  }

  async getTodoById(taskId: string): Promise<Todo> {
    try {
      const response = await axios.get<Todo>(
        `${API_URL}/todos/${taskId}`,
        await this.getAuthHeaders(),
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching todo with ID ${taskId}: `, error);
      throw error;
    }
  }

  async createTodo(newTodo: CreateTodoRequest): Promise<Todo> {
    try {
      const response = await axios.post<Todo>(
        `${API_URL}/todos`,
        newTodo,
        await this.getAuthHeaders(),
      );
      return response.data;
    } catch (error) {
      console.error('Error creating todo: ', error);
      throw error;
    }
  }

  async updateTodo(updatedTodo: UpdateTodoRequest): Promise<Todo> {
    try {
      const response = await axios.put<Todo>(
        `${API_URL}/todos/${updatedTodo.taskId}`,
        updatedTodo,
        await this.getAuthHeaders(),
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error updating todo with ID ${updatedTodo.taskId}: `,
        error,
      );
      throw error;
    }
  }

  async deleteTodo(taskId: string): Promise<void> {
    try {
      await axios.delete(
        `${API_URL}/todos/${taskId}`,
        await this.getAuthHeaders(),
      );
    } catch (error) {
      console.error(`Error deleting todo with ID ${taskId}: `, error);
      throw error;
    }
  }
}

export default new TodoService();
