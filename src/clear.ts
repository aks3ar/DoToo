import { getData, setData } from './dataStore';

/**
  * Reset the state of the application back to the start.
  *
  * @param {}  - An empty object
  * ...
  *
  * @returns {} - Returns an empty object.
  *
*/
export function clear() {
  let data = getData();

  data = {
    tags: [],
  };

  setData(data);
  return {};
}
