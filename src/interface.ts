export interface Error {
  error: string
  code: number
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
