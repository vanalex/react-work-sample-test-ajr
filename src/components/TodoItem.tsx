import React from 'react';
import styled from 'styled-components';
import {Todo} from '../types';

const TodoText = styled.span<{done: boolean}>`
  text-decoration: ${p => (p.done ? 'line-through' : 'none')};
`;

const TodoCheckbox = styled.input`
  margin-right: 8px;
`;

export interface TodoItemProps {
  todo: Todo;
  onToggle: OnToggle;
  className?: string;
}

export type OnToggle = (id: string | number) => void;

const _TodoItem: React.FC<TodoItemProps> = ({todo, onToggle, className}) => (
  <li data-cy='TodoItem' className={className}>
    <TodoCheckbox
      type='checkbox'
      checked={todo.done}
      onChange={() => {
        onToggle(todo.id);
      }}
    />
    <TodoText done={todo.done}>{todo.text}</TodoText>
  </li>
);

export const TodoItem = styled(_TodoItem)`
  display: flex;
  padding: 8px;
`;
