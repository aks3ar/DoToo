
export type Tag = {
  tagId: number;
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

export type Todo = {
  todoItemId: number;
  description: string;
  tagIds: number[];
  status: TodoStatus;
  parentId: number | null;
  score: TodoScore;
  deadline: number | null;
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
