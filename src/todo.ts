import HTTPError from 'http-errors';
import { getData, setData } from './dataStore';
import {
  Error,
  TodoDetailsReturn,
  TodoCreateReturn,
  NewTodo,
  TodoStatus,
  TodoScore,
  // TodoListReturn
} from './interface';

/**
  * Get details about a todo item
  *
  * @param {}  - An empty object
  * ...
  *
  * @returns {} - Returns an empty object.
  *
*/
export function todoDetails(todoItemId: number) : TodoDetailsReturn | Error {
  const data = getData();

  const findTodoItemId = data.todos.find(todo => todo.todoItemId === todoItemId);
  if (!findTodoItemId) {
    throw HTTPError(400, 'todoItemId is not valid');
  }

  const todoDetails : TodoDetailsReturn = {
    description: findTodoItemId.description,
    tagIds: findTodoItemId.tagIds,
    status: findTodoItemId.status,
    parentId: findTodoItemId.parentId,
    score: findTodoItemId.score
  };

  return todoDetails;
}

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

// export function todoList(parentId: number | null, tagIds: number[], status: TodoStatus) : TodoListReturn | Error {
//   const data = getData();
//   const lowerBound = 1;
//   const todoLimit = 50;

//   if (data.todos.length > todoLimit) {
//     throw HTTPError(400, 'There are already 50 todo items generated');
//   }

//   if (description.length < lowerBound) {
//     throw HTTPError(400, 'Description is less than 1 character');
//   }

//   if (parentId !== null && !data.todos.some(item => item.todoItemId === parentId)) {
//     throw HTTPError(400, 'parentId is not a valid todoItemId.');
//   }

//   const lowerCaseDescription = description.toLowerCase();
//   const descriptionExist = data.todos.some(todo => todo.description.toLowerCase() === lowerCaseDescription && todo.parentId === parentId);
//   if (descriptionExist) {
//     throw HTTPError(400, 'A todo item of this description, that shares a common immediate parent task (or a null parent), already exists');
//   }

//   let randomId: number;
//   let idExists;

//   do {
//     randomId = Math.floor(1000 + Math.random() * 9000);
//     idExists = data.tags.some(tag => tag.tagId === randomId);
//   } while (idExists);

//   const newTodo : NewTodo = {
//     todoItemId: randomId,
//     description: description,
//     tagIds: [],
//     parentId: parentId,
//     status: TodoStatus.TODO,
//     deadline: null,
//     score: TodoScore.NA
//   };

//   data.todos.push(newTodo);
//   setData(data);

//   return { todoItemId: randomId };
// }
