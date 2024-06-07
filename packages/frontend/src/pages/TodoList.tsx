import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  Checkbox,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
} from '@mui/material';
import { Todo } from '@sst-ion-serverless-todoapp/types';
import React, { useEffect, useState } from 'react';

import TodoService from '../services/todoService';

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todos = await TodoService.getTodos();
        setTodos(todos);
      } catch (error) {
        console.error('Error fetching todos: ', error);
      }
    };
    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (newTodoTitle.trim() === '') return;
    try {
      const newTodo = await TodoService.createTodo({
        title: newTodoTitle,
      });
      setTodos((prevTodos) => [...prevTodos, newTodo]);
      setNewTodoTitle('');
    } catch (error) {
      console.error('Error adding new todo: ', error);
    }
  };

  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    try {
      const updatedTodo = await TodoService.updateTodo({
        // TODO:fix eslint
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ...todos.find((todo) => todo.taskId === taskId)!,
        completed: !completed,
      });
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.taskId === updatedTodo.taskId ? updatedTodo : todo,
        ),
      );
    } catch (error) {
      console.error(`Error updating todo with ID ${taskId}: `, error);
    }
  };

  const handleDeleteTodo = async (taskId: string) => {
    try {
      await TodoService.deleteTodo(taskId);
      setTodos((prevTodos) =>
        prevTodos.filter((todo) => todo.taskId !== taskId),
      );
    } catch (error) {
      console.error(`Error deleting todo with ID ${taskId}: `, error);
    }
  };

  return (
    <Container maxWidth="sm">
      <h1>Todo List</h1>
      <List>
        {todos.map((todo) => (
          <ListItem key={todo.taskId}>
            <Checkbox
              checked={todo.completed}
              onChange={() => handleToggleComplete(todo.taskId, todo.completed)}
            />
            <ListItemText primary={todo.title} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDeleteTodo(todo.taskId)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <TextField
        label="New Todo"
        value={newTodoTitle}
        onChange={(e) => setNewTodoTitle(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleAddTodo}>
        Add Todo
      </Button>
    </Container>
  );
};

export default TodoList;
