import React from 'react';
import styled from 'styled-components';
import {TodosFooter} from './components/TodosFooter';
import {TodosHeader} from './components/TodosHeader';
import {OnSubmit, TodoInput} from './components/TodoInput';
import {TodoList} from './components/TodoList';
import {Todo} from './types';
import {TodoStatusBar} from './components/TodoStatusBar';
import {TodoService} from './service/todoService';
import {v4 as uuidv4} from 'uuid';
import {sortTodosByTimestamp} from './components/utils/TodoUtils';

export const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  width: 400px;
  margin: 0 auto;
  height: 100vh;
`;

export const App: React.FC = () => {
  const [todos, setTodos] = React.useState<Todo[]>([]);

  const fetchTodos = async () => {
    const response = await TodoService.getTodos();
    const sortedTodos = sortTodosByTimestamp(response);
    setTodos(sortedTodos);
  };

  const createTodo: OnSubmit = async text => {
    const newTodo = {
      id: uuidv4(),
      text,
      done: false,
      createdTimestamp: Date.now(),
    };

    await TodoService.createTodo(newTodo);
    fetchTodos();
    return '';
  };

  const toggleTodo = async (id: string | number) => {
    const todo = todos.find(todo => todo.id === id);
    if (!todo) return;
    const updatedTodo = {...todo, done: !todo.done};
    await TodoService.updateTodo(updatedTodo);
    setTodos(prev => prev.map(t => (t.id === id ? updatedTodo : t)));
  };

  const totalTodos = todos.length;
  const doneTodos = todos.filter(todo => todo.done).length;
  const allDone = todos.length > 0 && todos.every(todo => todo.done);

  React.useEffect(() => {
    fetchTodos();
  }, []);

  React.useEffect(() => {
    if (allDone) {
      alert(
        `Congratulations, you're all set! You've done everything on your list.`
      );
    }
  }, [allDone]);

  return (
    <AppContainer className='App'>
      <TodosHeader>
        <TodoStatusBar total={totalTodos} done={doneTodos} />
      </TodosHeader>
      <TodoInput onSubmit={createTodo} />
      <TodoList todos={todos} onToggle={toggleTodo} />
      <TodosFooter>
        <TodoStatusBar total={totalTodos} done={doneTodos} />
      </TodosFooter>
    </AppContainer>
  );
};
