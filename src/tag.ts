import HTTPError from 'http-errors';
import { getData, setData } from './dataStore';
import {
  Error,
  TagCreateReturn,
  TagList,
  TagListReturn,
  TagNameReturn
} from './interface';

/**
  * Get a list of all tags
  *
  * @param {}  - An empty object
  * ...
  *
  * @returns {} - Returns an empty object.
  *
*/
export function tagList() : TagListReturn | Error {
  const data = getData();

  const tags: TagList[] = [];
  let currTag: any;
  for (currTag of data.tags) {
    if (currTag) {
      tags.push(
        {
          tagId: currTag.tagId,
          name: currTag.name
        }
      );
    }
  }

  return { tags };
}

/**
  * Get a tag name
  *
  * @param {}  - An empty object
  * ...
  *
  * @returns {} - Returns an empty object.
  *
*/
export function tagName(tagId: number) : TagNameReturn | Error {
  const data = getData();

  const findTag = data.tags.find(tag => tag.tagId === tagId);
  if (!findTag) {
    throw HTTPError(400, 'tagId does not exist');
  }

  return { name: findTag.name };
}

/**
  * Delete a tag
  *
  * @param {}  - An empty object
  * ...
  *
  * @returns {} - Returns an empty object.
  *
*/
export function tagDelete(tagId: number) : object | Error {
  const data = getData();

  const findTag = data.tags.find(tag => tag.tagId === tagId);
  if (!findTag) {
    throw HTTPError(400, 'tagId does not exist');
  }

  const index = data.tags.findIndex(tag => tag.tagId === tagId);
  data.tags.splice(index, 1);
  setData(data);

  return {};
}

/**
  * Create a new tag
  *
  * @param {}  - An empty object
  * ...
  *
  * @returns {} - Returns an empty object.
  *
*/
export function tagCreate(name: string) : TagCreateReturn | Error {
  const data = getData();
  const lowerBound = 1;
  const upperBound = 10;

  if (name.length < lowerBound) {
    throw HTTPError(400, 'name is shorter than 1 character');
  }

  if (name.length > upperBound) {
    throw HTTPError(400, 'name is longer than 10 characters');
  }

  const lowerCaseName = name.toLowerCase();
  const nameExist = data.tags.some(tag => tag.name.toLowerCase() === lowerCaseName);
  if (nameExist) {
    throw HTTPError(400, 'a tag with this name already exists (comparisons are case insensitive)');
  }

  let randomId: number;
  let idExists;

  do {
    randomId = Math.floor(1000 + Math.random() * 9000);
    idExists = data.tags.some(tag => tag.tagId === randomId);
  } while (idExists);

  const newTag = {
    tagId: randomId,
    name: name
  };

  data.tags.push(newTag);
  setData(data);

  return { tagId: randomId };
}
