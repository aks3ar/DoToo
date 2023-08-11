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
  status: string;
  parentId: any | number | null;
  score: string;
}

export interface NewTodo {
  todoItemId: any;
  description: string;
  tagIds: number[];
  parentId: any | number | null;
  status: string;
  deadline: number | null;
  score: string;
  timeCreated: number;
}

export interface TodoCreateReturn {
  todoItemId: any;
}

export interface TodoListTime {
  todoItemId: any;
  deadline: number | null;
  description: string;
  tagIds: number[];
  status: string;
  parentId: any | number | null;
  score: string;
  timeCreated: number;
}

export interface TodoList {
  description: string;
  tagIds: number[];
  status: string;
  parentId: any | number | null;
  score: string;
}

export interface TodoListReturn {
  todoItems: TodoList[];
}

export interface SummaryReturn {
  todoItemIds: number[];
}
