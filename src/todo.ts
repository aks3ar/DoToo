import HTTPError from 'http-errors';
import { getData, setData } from './dataStore';
import {
  Error,
  TodoDetailsReturn,
  TodoCreateReturn,
  // NewTodo,
  // TodoStatuses,
  // TodoScores,
  TodoListTime,
  TodoList,
  TodoListReturn
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
export function todoDetails(todoItemId: number): TodoDetailsReturn | Error {
  const data = getData();

  const findTodoItemId = data.todos.find(todo => todo.todoItemId === todoItemId);
  if (!findTodoItemId) {
    throw HTTPError(400, 'todoItemId is not valid');
  }

  const todoDetails: TodoDetailsReturn = {
    description: findTodoItemId.description,
    tagIds: findTodoItemId.tagIds,
    status: findTodoItemId.status,
    parentId: findTodoItemId.parentId,
    score: findTodoItemId.score
  };

  return todoDetails;
}

/**
  * Delete a todo item
  *
  * @param {}  - An empty object
  * ...
  *
  * @returns {} - Returns an empty object.
  *
*/
export function todoDelete(todoItemId: number): object | Error {
  const data = getData();
  // console.log('initially', data.todos);

  const findTodoItemId = data.todos.find(todo => todo.todoItemId === todoItemId);
  if (!findTodoItemId) {
    throw HTTPError(400, 'todoItemId is not valid');
  }

  doTodoDelete(todoItemId);

  // console.log('after deletion', data.todos);
  return {};
}

function doTodoDelete(todoItemId: number) {
  const data = getData();
  const itemIndex = data.todos.findIndex(todo => todo.todoItemId === todoItemId);
  let deletedItem: any;

  if (itemIndex !== -1) {
    deletedItem = data.todos.splice(itemIndex, 1)[0];
    const childrenIds = data.todos.filter(todo => todo.parentId === todoItemId).map(todo => todo.todoItemId);
    for (const childId of childrenIds) {
      doTodoDelete(childId);
    }

    if (deletedItem) {
      const deletedTagIds = deletedItem.tagIds;
      for (const tagId of deletedTagIds) {
        const tagIndex = data.tags.findIndex(tag => tag.tagId === tagId);
        if (tagIndex !== -1) {
          data.tags.splice(tagIndex, 1);
        }
      }
    }
  }
}

/**
  * Create a new todo item
  *
  * @param {}  - An empty object
  * ...
  *
  * @returns {} - Returns an empty object.
  *
*/
export function todoCreate(description: string, parentId: number | null): TodoCreateReturn | Error {
  const data = getData();
  const lowerBound = 1;
  const todoLimit = 50;

  if (data.todos.length > todoLimit) {
    throw HTTPError(400, 'There are already 50 todo items generated');
  }

  if (description.length < lowerBound) {
    throw HTTPError(400, 'Description is less than 1 character');
  }

  if (parentId !== null) {
    const parent = data.todos.find((parent) => parent.todoItemId === parentId);
    if (!parent) {
      throw HTTPError(400, 'parentId does not refer to a different, existing todo item.');
    }

    const lowerCaseDescription = description.toLowerCase();
    const descriptionExist = parent.description.toLowerCase() === lowerCaseDescription;
    if (descriptionExist) {
      throw HTTPError(400, 'A todo item of this description, that shares a common immediate parent task (or a null parent), already exists');
    }
  }

  let randomId: number;
  let idExists;

  do {
    randomId = Math.floor(1000 + Math.random() * 9000);
    idExists = data.tags.some(tag => tag.tagId === randomId);
  } while (idExists);

  const unixTime = Math.floor(Date.now());

  const newTodo: any = {
    todoItemId: randomId,
    description: description,
    tagIds: [],
    parentId: parentId,
    status: 'TODO',
    deadline: null,
    score: 'NA',
    timeCreated: unixTime
  };

  data.todos.push(newTodo);
  setData(data);

  return { todoItemId: randomId };
}

export function todoUpdate(todoItemId: any, description: string, tagIds: number[], status: string, parentId: number | null, deadline: number | null): object | Error {
  const data = getData();
  const lowerBound = 1;

  if (isNaN(todoItemId)) {
    throw HTTPError(400, 'todoItemId is not valid');
  }

  if (parentId === todoItemId) {
    throw HTTPError(400, 'parentId refers to this todo list items ID');
  }

  if (description.length < lowerBound) {
    throw HTTPError(400, 'Description is less than 1 character');
  }

  const parent = data.todos.find((todo) => todo.todoItemId === parentId);
  if (parent) {
    const lowerCaseDescription = description.toLowerCase();
    const descriptionExist = parent.description.toLowerCase() === lowerCaseDescription;
    if (descriptionExist) {
      throw HTTPError(400, 'A todo item of this description, that shares a common immediate parent task (or a null parent), already exists');
    }
  }

  const statuses = ['TODO', 'INPROGRESS', 'BLOCKED', 'DONE'];
  if (!statuses.includes(status)) {
    throw HTTPError(400, 'status is not a valid enum of statuses');
  }

  const validTagIds = data.tags.map(tag => tag.tagId);
  for (const tagId of tagIds) {
    if (!validTagIds.includes(tagId)) {
      throw HTTPError(400, 'tagIds contains any invalid tagIds');
    }
  }

  if (parentId !== null) {
    if (!data.todos.some(todo => todo.todoItemId === parentId)) {
      throw HTTPError(400, 'parentId is not null and does not refer to an exiting todoItemId');
    }
  }

  if (data.todos.length > 3) {
    if (cycleCheck(todoItemId, parentId)) {
      throw HTTPError(400, 'parentId would create a cycle in the todo list structure');
    }
  }

  if (deadline < 0 || deadline > Math.pow(2, 32) - 1) {
    throw HTTPError(400, 'deadline is not null and is not a valid unix timestamp');
  }

  const todoToUpdate = data.todos.find(todo => todo.todoItemId === todoItemId);
  const timeNow = Math.floor(Date.now() / 1000);
  const early = timeNow < deadline;
  const late = deadline < timeNow;
  const noDeadline = deadline === null;

  if (todoToUpdate.status !== status && todoToUpdate.deadline !== deadline) {
    if (status === 'DONE' && late) {
      todoToUpdate.score = 'LOW';
    }
    if (status === 'DONE' && early) {
      todoToUpdate.score = 'HIGH';
    }
    if (status === 'DONE' && noDeadline) {
      todoToUpdate.score = 'HIGH';
    }
  }

  todoToUpdate.description = description;
  todoToUpdate.tagIds = tagIds;
  todoToUpdate.status = status;
  todoToUpdate.parentId = parentId;
  todoToUpdate.deadline = deadline;

  return {};
}

function cycleCheck(currentTodoItemId: number, newParentId: number): boolean {
  const data = getData();
  const visited = new Set<number>();
  visited.add(currentTodoItemId);

  let current = data.todos.find(todo => todo.todoItemId === newParentId);

  while (current) {
    if (current.todoItemId === currentTodoItemId) {
      return true;
    }

    visited.add(current.todoItemId);

    if (current.parentId === null) {
      break;
    }

    current = data.todos.find(todo => todo.todoItemId === current.parentId);

    if (visited.has(current.todoItemId)) {
      return true;
    }
  }

  return false;
}

export function todoList(parentId: number | null, tagIds?: number[] | null, status?: string | null): TodoListReturn | Error {
  const data = getData();
  const statuses = ['TODO', 'INPROGRESS', 'BLOCKED', 'DONE'];

  if (status !== null) {
    if (!statuses.includes(status)) {
      throw HTTPError(400, 'status is not a valid status');
    }
  }

  // if (tagIds !== null) {
  //   if (tagIds.length === 0 || tagIds.some(tagId => !data.tags.some(tag => tag.tagId === tagId))) {
  //     throw HTTPError(400, 'tagIds is an empty list or tagIds contains any invalid tagId');
  //   }
  // }

  if (parentId !== null) {
    if (!data.todos.some(todo => todo.todoItemId === parentId)) {
      throw HTTPError(400, 'parentId does not refer to a valid todo item');
    }
  }

  let todoList: TodoListTime[] = [...data.todos];

  if (tagIds !== null) {
    todoList = todoList.filter(todo => arrayEquals(todo.tagIds, tagIds));
  }

  if (status !== null) {
    todoList = todoList.filter(todo => todo.status === status);
  }

  if (parentId !== null) {
    todoList = todoList.filter(todo => todo.todoItemId === parentId);
  }

  todoList.sort((a, b) => b.timeCreated - a.timeCreated);

  const filteredTodoList: TodoList[] = todoList.map(({ timeCreated, todoItemId, deadline, ...rest }) => rest);

  return { todoItems: filteredTodoList };
}

function arrayEquals(a: number[], b: number[]): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}
