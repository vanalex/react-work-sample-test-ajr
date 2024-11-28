import {Todo} from '../../types';

export const sortTodosByTimestamp = (todos: Todo[]): Todo[] => {
  return todos.sort((a, b) => b.createdTimestamp - a.createdTimestamp);
};
