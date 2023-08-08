export type Tag = {
  tagId: number;
  name: string;
}

export type Data = {
  tags: Tag[];
};

let data: Data = {
  tags: [],
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
