import HTTPError from 'http-errors';
import { getData, setData } from './dataStore';
import {
  Error,
  TodoCreateReturn,
  NewTodo,
  TodoStatus,
  TodoScore
} from './interface';

/**
  * Get a list of all tags
  *
  * @param {}  - An empty object
  * ...
  *
  * @returns {} - Returns an empty object.
  *
*/
export function todoCreate(description: string, parentId: number) : TodoCreateReturn | Error {
  const data = getData();
  const lowerBound = 1;
  const todoLimit = 50;

  if (data.todos.length > todoLimit) {
    throw HTTPError(400, 'There are already 50 todo items generated');
  }

  if (description.length < lowerBound) {
    throw HTTPError(400, 'Description is less than 1 character');
  }

  if (parentId !== null && !data.todos.some(item => item.todoItemId === parentId)) {
    throw HTTPError(400, 'parentId is not a valid todoItemId.');
  }

  const lowerCaseDescription = description.toLowerCase();
  const descriptionExist = data.todos.some(todo => todo.description.toLowerCase() === lowerCaseDescription && todo.parentId === parentId);
  if (descriptionExist) {
    throw HTTPError(400, 'A todo item of this description, that shares a common immediate parent task (or a null parent), already exists');
  }

  let randomId: number;
  let idExists;

  do {
    randomId = Math.floor(1000 + Math.random() * 9000);
    idExists = data.tags.some(tag => tag.tagId === randomId);
  } while (idExists);

  const newTodo : NewTodo = {
    todoItemId: randomId,
    description: description,
    tagIds: [],
    parentId: parentId,
    status: TodoStatus.TODO,
    deadline: null,
    score: TodoScore.NA
  };

  data.todos.push(newTodo);
  setData(data);

  return { todoItemId: randomId };
}
