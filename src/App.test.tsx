import {TodoService} from './service/todoService';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {App} from './App';

jest.mock('./service/todoService', () => ({
  TodoService: {
    getTodos: jest.fn(),
    createTodo: jest.fn(),
    updateTodo: jest.fn(),
  },
}));

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and display todos', async () => {
    const mockTodos = [
      {id: '1', text: 'First Todo', done: false, createdTimestamp: 1000},
      {id: '2', text: 'Second Todo', done: true, createdTimestamp: 2000},
    ];
    (TodoService.getTodos as jest.Mock).mockResolvedValue(mockTodos);

    render(<App />);

    expect(await screen.findByText('First Todo')).toBeInTheDocument();
    expect(screen.getByText('Second Todo')).toBeInTheDocument();
  });

  it('should add a new todo', async () => {
    const mockTodos = [
      {id: '1', text: 'First Todo', done: false, createdTimestamp: 1000},
    ];
    (TodoService.getTodos as jest.Mock).mockResolvedValue(mockTodos);
    (TodoService.createTodo as jest.Mock).mockResolvedValue(undefined);

    render(<App />);

    await screen.findByText('First Todo');

    const input = screen.getByPlaceholderText('todo title');
    const addButton = screen.getByText('+');
    fireEvent.change(input, {target: {value: 'New Todo'}});
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(TodoService.createTodo).toHaveBeenCalledWith(
        expect.objectContaining({
          text: 'New Todo',
          done: false,
        })
      );
    });
  });

  it("should toggle a todo's done status", async () => {
    const mockTodos = [
      {id: '1', text: 'First Todo', done: false, createdTimestamp: 1000},
    ];
    (TodoService.getTodos as jest.Mock).mockResolvedValue(mockTodos);
    (TodoService.updateTodo as jest.Mock).mockResolvedValue(undefined);

    render(<App />);

    const checkbox = await screen.findByRole('checkbox');

    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(TodoService.updateTodo).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '1',
          done: true,
        })
      );
    });
  });

  it('should alert when all todos are marked as done', async () => {
    const mockTodos = [
      {id: '1', text: 'First Todo', done: false, createdTimestamp: 1000},
      {id: '2', text: 'Second Todo', done: false, createdTimestamp: 2000},
    ];
    (TodoService.getTodos as jest.Mock).mockResolvedValue(mockTodos);

    jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<App />);

    const checkboxes = await screen.findAllByRole('checkbox');

    checkboxes.forEach(checkbox => {
      fireEvent.click(checkbox);
    });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        `Congratulations, you're all set! You've done everything on your list.`
      );
    });
  });
});
