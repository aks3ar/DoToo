export interface Error {
  error: string;
  code: number;
}

export interface TagCreateReturn {
  tagId: number;
}

export interface TagList {
  tagId: number;
  name: string;
}

export interface TagListReturn {
  tags: TagList[];
}

export interface TagNameReturn {
  name: string;
}

export enum TodoStatus {
  TODO = 'TODO',
  INPROGRESS = 'INPROGRESS',
  BLOCKED = 'BLOCKED',
  DONE = 'DONE',
}

export enum TodoScore {
  NA = 'NA',
  LOW = 'LOW',
  HIGH = 'HIGH',
}

export interface TodoDetailsReturn {
  description: string;
  tagIds: number[];
  status: TodoStatus;
  parentId: number;
  score: TodoScore;
}

export interface NewTodo {
  todoItemId: number;
  description: string;
  tagIds: number[];
  parentId: number | null;
  status: TodoStatus;
  deadline: number | null;
  score: TodoScore;
}

export interface TodoCreateReturn {
  todoItemId: number;
}

export interface TodoItems {
  description: string;
  tagIds: TagList[];
  status: TodoStatus;
  parentId: number;
  score: TodoScore;
}

export interface TodoListReturn {
  todoItems: TodoItems[];
}
