import {Todo} from '../types';

const API_URL = 'http://localhost:3001/todos';

export const TodoService = {
  async getTodos(): Promise<Todo[]> {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('error fetching todos:', error);
      return [];
    }
  },
  async createTodo(todo: Todo): Promise<Todo | null> {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      });
      if (!response.ok) {
        throw new Error(
          `Unexpected error ${response.status}: ${response.statusText}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating todo: ', error);
      return null;
    }
  },
  async updateTodo(todo: Todo): Promise<Todo | null> {
    try {
      const response = await fetch(`${API_URL}/${todo.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      });
      if (!response.ok) {
        throw new Error(
          `Unexpected error ${response.status}: ${response.statusText}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating todo: ', error);
      return null;
    }
  },
};
