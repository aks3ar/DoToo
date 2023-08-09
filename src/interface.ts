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

export enum TodoStatuses {
  TODO = 'TODO',
  INPROGRESS = 'INPROGRESS',
  BLOCKED = 'BLOCKED',
  DONE = 'DONE',
}

export enum TodoScores {
  NA = 'NA',
  LOW = 'LOW',
  HIGH = 'HIGH',
}

export interface TodoDetailsReturn {
  description: string;
  tagIds: number[];
  status: TodoStatuses;
  parentId: number | null;
  score: TodoScores;
}

export interface NewTodo {
  todoItemId: number;
  description: string;
  tagIds: number[];
  parentId: number | null;
  status: TodoStatuses;
  deadline: number | null;
  score: TodoScores;
  timeCreated: number;
}

export interface TodoCreateReturn {
  todoItemId: number;
}

export interface TodoListTime {
  todoItemId: number;
  deadline: number;
  description: string;
  tagIds: number[];
  status: TodoStatuses;
  parentId: number | null;
  score: TodoScores;
  timeCreated: number;
}

export interface TodoList {
  description: string;
  tagIds: number[];
  status: TodoStatuses;
  parentId: number | null;
  score: TodoScores;
}

export interface TodoListReturn {
  todoItems: TodoList[];
}
