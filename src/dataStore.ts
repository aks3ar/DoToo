import {
  TodoStatuses,
  TodoScores
} from './interface';

export type Tag = {
  tagId: number;
  name: string;
}

export type Todo = {
  todoItemId: number;
  description: string;
  tagIds: number[];
  status: TodoStatuses;
  parentId: any | number | null;
  score: TodoScores;
  deadline: number | null;
  timeCreated: number;
}

export type Data = {
  tags: Tag[];
  todos: Todo[];
};

let data: Data = {
  tags: [],
  todos: [],
};

// Use get() to access the data
function getData() {
  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
function setData(newData: Data) {
  data = newData;
}

export { getData, setData };
