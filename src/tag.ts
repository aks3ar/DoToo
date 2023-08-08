import HTTPError from 'http-errors';
import { getData, setData } from './dataStore';

/**
  * Get a list of all tags
  *
  * @param {}  - An empty object
  * ...
  *
  * @returns {} - Returns an empty object.
  *
*/

/**
  * Get a tag name
  *
  * @param {}  - An empty object
  * ...
  *
  * @returns {} - Returns an empty object.
  *
*/

/**
  * Delete a tag
  *
  * @param {}  - An empty object
  * ...
  *
  * @returns {} - Returns an empty object.
  *
*/

/**
  * Create a new tag
  *
  * @param {}  - An empty object
  * ...
  *
  * @returns {} - Returns an empty object.
  *
*/
export function tagCreate(name: string) {
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
