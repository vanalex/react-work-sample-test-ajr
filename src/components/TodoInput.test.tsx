import React from 'react';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import {TodoInput, TodoInputProps, DEFAULT_PLACEHOLDER} from './TodoInput';

describe('TodoInput Component', () => {
  const mockOnSubmit: jest.MockedFunction<TodoInputProps['onSubmit']> =
    jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the input and button with default placeholder', () => {
    render(<TodoInput onSubmit={mockOnSubmit} />);

    const input = screen.getByPlaceholderText(DEFAULT_PLACEHOLDER);
    const button = screen.getByText('+');

    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it('allows typing into the input', () => {
    render(<TodoInput onSubmit={mockOnSubmit} />);

    const input = screen.getByPlaceholderText(DEFAULT_PLACEHOLDER);

    fireEvent.change(input, {target: {value: 'New Todo'}});
    expect(input).toHaveValue('New Todo');
  });

  it('calls onSubmit with the correct text when button is clicked', async () => {
    mockOnSubmit.mockResolvedValueOnce('');

    render(<TodoInput onSubmit={mockOnSubmit} />);

    const input = screen.getByPlaceholderText(DEFAULT_PLACEHOLDER);
    const button = screen.getByText('+');

    fireEvent.change(input, {target: {value: 'New Todo'}});
    fireEvent.click(button);

    await waitFor(() => expect(mockOnSubmit).toHaveBeenCalledWith('New Todo'));
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('clears the input after successful submission', async () => {
    mockOnSubmit.mockResolvedValueOnce('');

    render(<TodoInput onSubmit={mockOnSubmit} />);

    const input = screen.getByPlaceholderText(DEFAULT_PLACEHOLDER);
    const button = screen.getByText('+');

    fireEvent.change(input, {target: {value: 'New Todo'}});
    fireEvent.click(button);

    await waitFor(() => expect(input).toHaveValue(''));
  });

  it('does not call onSubmit if input is empty', () => {
    render(<TodoInput onSubmit={mockOnSubmit} />);

    const button = screen.getByText('+');
    fireEvent.click(button);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('renders a custom placeholder if provided', () => {
    const customPlaceholder = 'Enter a todo';
    render(
      <TodoInput onSubmit={mockOnSubmit} placeholder={customPlaceholder} />
    );

    const input = screen.getByPlaceholderText(customPlaceholder);
    expect(input).toBeInTheDocument();
  });
});
