import {
  requestClear,
  // requestTodoDetails,
  // requestTodoDelete,
  requestTodoCreate,
  // requestTodoUpdate,
  // requestTodoList,
  // requestTodoBulk
} from './helperTest';

const OK = 200;
const ERROR = { error: expect.any(String) };

// let tagListObj: any;
// let firstTagId: any;

// describe('requestTodoDetails Tests', () => {
//   beforeEach(() => {
//     requestClear();
//     requestTagCreate('Tag1');
//     tagListObj = requestTagList();
//     const firstTag = tagListObj.returnBody.tags[0];
//     firstTagId = firstTag.tagId;
//   });
//   test('All Correct', () => {
//     const res = requestTagName(firstTagId);
//     expect(res.statusCode).toStrictEqual(OK);
//     expect(res.returnBody).toStrictEqual({ name: 'Tag1' });
//   });
//   test('tagId does not exist', () => {
//     const res = requestTagName(-1);
//     expect(res.statusCode).toStrictEqual(400);
//     expect(res.returnBody).toStrictEqual(ERROR);
//   });
// });

// describe('requestTodoDelete Tests', () => {
//   beforeEach(() => {
//     requestClear();
//     requestTagCreate('Tag1');
//     tagListObj = requestTagList();
//     const firstTag = tagListObj.returnBody.tags[0];
//     firstTagId = firstTag.tagId;
//   });
//   test('All Correct', () => {
//     const res = requestTagName(firstTagId);
//     expect(res.statusCode).toStrictEqual(OK);
//     expect(res.returnBody).toStrictEqual({ name: 'Tag1' });
//   });
//   test('tagId does not exist', () => {
//     const res = requestTagName(-1);
//     expect(res.statusCode).toStrictEqual(400);
//     expect(res.returnBody).toStrictEqual(ERROR);
//   });
// });

describe('requestTodoCreate Tests', () => {
  beforeEach(() => {
    requestClear();
  });
  test('All Correct', () => {
    const res = requestTodoCreate('description', null);
    expect(res.statusCode).toStrictEqual(OK);
    expect(res.returnBody).toStrictEqual({ todoItemId: expect.any(Number) });
  });
  test('There are already 50 todo items generated', () => {
    for (let i = 0; i < 51; i++) {
      requestTodoCreate(`Todo ${i}`, null);
    }
    const res = requestTodoCreate('description', null);
    expect(res.statusCode).toStrictEqual(400);
    expect(res.returnBody).toStrictEqual(ERROR);
  });
  test('Description is less than 1 character', () => {
    const res = requestTodoCreate('', null);
    expect(res.statusCode).toStrictEqual(400);
    expect(res.returnBody).toStrictEqual(ERROR);
  });
  test('parentId is not a valid todoItemId.', () => {
    const res = requestTodoCreate('description', undefined);
    expect(res.statusCode).toStrictEqual(400);
    expect(res.returnBody).toStrictEqual(ERROR);
  });
  test.skip('A todo item of this description, that shares a common immediate parent task (or a null parent), already exists.', () => {
    const res = requestTodoCreate('description', null);
    expect(res.statusCode).toStrictEqual(400);
    expect(res.returnBody).toStrictEqual(ERROR);
  });
});

// describe('requestTodoUpdate Tests', () => {
//   beforeEach(() => {
//     requestClear();
//     requestTagCreate('Tag1');
//     tagListObj = requestTagList();
//     const firstTag = tagListObj.returnBody.tags[0];
//     firstTagId = firstTag.tagId;
//   });
//   test('All Correct', () => {
//     const res = requestTagName(firstTagId);
//     expect(res.statusCode).toStrictEqual(OK);
//     expect(res.returnBody).toStrictEqual({ name: 'Tag1' });
//   });
//   test('tagId does not exist', () => {
//     const res = requestTagName(-1);
//     expect(res.statusCode).toStrictEqual(400);
//     expect(res.returnBody).toStrictEqual(ERROR);
//   });
// });

// describe('requestTodoList Tests', () => {
//   beforeEach(() => {
//     requestClear();
//     requestTagCreate('Tag1');
//     tagListObj = requestTagList();
//     const firstTag = tagListObj.returnBody.tags[0];
//     firstTagId = firstTag.tagId;
//   });
//   test('All Correct', () => {
//     const res = requestTagName(firstTagId);
//     expect(res.statusCode).toStrictEqual(OK);
//     expect(res.returnBody).toStrictEqual({ name: 'Tag1' });
//   });
//   test('tagId does not exist', () => {
//     const res = requestTagName(-1);
//     expect(res.statusCode).toStrictEqual(400);
//     expect(res.returnBody).toStrictEqual(ERROR);
//   });
// });

// describe('requestTagName Tests', () => {
//   beforeEach(() => {
//     requestClear();
//     requestTagCreate('Tag1');
//     tagListObj = requestTagList();
//     const firstTag = tagListObj.returnBody.tags[0];
//     firstTagId = firstTag.tagId;
//   });
//   test('All Correct', () => {
//     const res = requestTagName(firstTagId);
//     expect(res.statusCode).toStrictEqual(OK);
//     expect(res.returnBody).toStrictEqual({ name: 'Tag1' });
//   });
//   test('tagId does not exist', () => {
//     const res = requestTagName(-1);
//     expect(res.statusCode).toStrictEqual(400);
//     expect(res.returnBody).toStrictEqual(ERROR);
//   });
// });

// describe('requestTodoBulk Tests', () => {
//   beforeEach(() => {
//     requestClear();
//     requestTagCreate('Tag1');
//     tagListObj = requestTagList();
//     const firstTag = tagListObj.returnBody.tags[0];
//     firstTagId = firstTag.tagId;
//   });
//   test('All Correct', () => {
//     const res = requestTagName(firstTagId);
//     expect(res.statusCode).toStrictEqual(OK);
//     expect(res.returnBody).toStrictEqual({ name: 'Tag1' });
//   });
//   test('tagId does not exist', () => {
//     const res = requestTagName(-1);
//     expect(res.statusCode).toStrictEqual(400);
//     expect(res.returnBody).toStrictEqual(ERROR);
//   });
// });
