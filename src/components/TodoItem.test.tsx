import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import {TodoItem, TodoItemProps} from './TodoItem';
import {Todo} from '../types';

describe('TodoItem Component', () => {
  const mockTodo: Todo = {
    id: '1',
    text: 'Test Todo',
    done: false,
    createdTimestamp: Date.now(),
  };

  const mockOnToggle = jest.fn();

  const renderComponent = (props: Partial<TodoItemProps> = {}) => {
    const defaultProps: TodoItemProps = {
      todo: mockTodo,
      onToggle: mockOnToggle,
      ...props,
    };

    return render(<TodoItem {...defaultProps} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the todo text', () => {
    renderComponent();

    const todoText = screen.getByText('Test Todo');
    expect(todoText).toBeInTheDocument();
  });

  it('displays a checkbox with the correct initial state', () => {
    renderComponent();

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it('calls onToggle when the checkbox is clicked', () => {
    renderComponent();

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockOnToggle).toHaveBeenCalledTimes(1);
    expect(mockOnToggle).toHaveBeenCalledWith(mockTodo.id);
  });

  it('displays the todo text with line-through when done', () => {
    renderComponent({todo: {...mockTodo, done: true}});

    const todoText = screen.getByText('Test Todo');
    expect(todoText).toHaveStyle('text-decoration: line-through');
  });

  it('displays the todo text without line-through when not done', () => {
    renderComponent({todo: {...mockTodo, done: false}});

    const todoText = screen.getByText('Test Todo');
    expect(todoText).toHaveStyle('text-decoration: none');
  });

  it('updates the checkbox when todo.done changes', () => {
    const {rerender} = renderComponent({todo: {...mockTodo, done: false}});

    let checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    rerender(
      <TodoItem todo={{...mockTodo, done: true}} onToggle={mockOnToggle} />
    );

    checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });
});
