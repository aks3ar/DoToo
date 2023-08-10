import request, { HttpVerb } from 'sync-request';
import { url, port } from './config.json';
// import { TodoStatuses } from './interface';

const SERVER_URL = `${url}:${port}`;

export function requestHelper(method: HttpVerb, path: string, payload: object, headers?: any): any {
  let qs = {};
  let json = {};
  if (['GET', 'DELETE'].includes(method)) {
    qs = payload;
  } else {
    // PUT/POST
    json = payload;
  }
  const res = request(method, SERVER_URL + path, { qs, json, timeout: 20000, headers });
  return {
    statusCode: res.statusCode,
    returnBody: JSON.parse(res.body.toString()),
  };
}

export function requestClear() {
  return requestHelper('DELETE', '/clear', { }, { });
}

export function requestTagList() {
  return requestHelper('GET', '/tag/list', { }, { });
}

export function requestTagName(tagId: number) {
  return requestHelper('GET', '/tag', { tagId }, { });
}

export function requestTagDelete(tagId: number) {
  return requestHelper('DELETE', '/tag', { tagId }, { });
}

export function requestTagCreate(name: string) {
  return requestHelper('POST', '/tag', { name }, { });
}

export function requestTodoDetails(todoItemId: number) {
  return requestHelper('GET', '/todo/item', { todoItemId }, { });
}

export function requestTodoDelete(todoItemId: number) {
  return requestHelper('DELETE', '/todo/item', { todoItemId }, { });
}

export function requestTodoCreate(description: string, parentId: number | null) {
  return requestHelper('POST', '/todo/item', { description, parentId }, { });
}

export function requestTodoUpdate(todoItemId: any, description: string, tagIds: number[], status: string, parentId: number | null, deadline: number | null) {
  return requestHelper('PUT', '/todo/item', { todoItemId, description, tagIds: JSON.stringify(tagIds), status, parentId, deadline }, { });
}

export function requestTodoList(parentId: number | null, tagIds?: number[] | null, status?: string | null) {
  return requestHelper('GET', '/todo/list', { parentId, tagIds: JSON.stringify(tagIds), status }, { });
}

export function requestTodoBulk(bulkString: string) {
  return requestHelper('POST', '/todo/item/bulk', { bulkString }, { });
}

export function requestSummary(step: number) {
  return requestHelper('GET', '/summary', { step }, { });
}

export function requestNotifications() {
  return requestHelper('GET', '/notifications', { }, { });
}
