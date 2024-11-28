import React from 'react';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {TodoList} from './TodoList';
import {Todo} from '../types';

const mockTodos: Todo[] = [
  {id: '1', text: 'Test Todo 1', done: false, createdTimestamp: Date.now()},
  {id: '2', text: 'Test Todo 2', done: true, createdTimestamp: Date.now()},
];
describe('TodoList Component', () => {
  test('renders TodoList', () => {
    const onToggle = jest.fn();
    const {getByText} = render(
      <TodoList todos={mockTodos} onToggle={onToggle} />
    );

    expect(getByText('Test Todo 1')).toBeInTheDocument();
    expect(getByText('Test Todo 2')).toBeInTheDocument();
  });

  test('renders todos with the correct checkbox states', async () => {
    const user = userEvent.setup();
    const onToggle = jest.fn();
    const {getAllByRole} = render(
      <TodoList todos={mockTodos} onToggle={onToggle} />
    );

    const checkboxes = getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(2);

    await user.click(checkboxes[0]);
    expect(onToggle).toBeCalledWith(mockTodos[0].id);

    await user.click(checkboxes[1]);
    expect(onToggle).toBeCalledWith(mockTodos[1].id);
  });
});
