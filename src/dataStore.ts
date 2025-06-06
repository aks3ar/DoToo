// import {
//   TodoStatuses,
//   TodoScores
// } from './interface';

export type Tag = {
  tagId: number;
  name: string;
}

export type Todo = {
  timeCompleted: number;
  todoItemId: any;
  description: string;
  tagIds: number[];
  status: string;
  parentId: any | number | null;
  score: string;
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
