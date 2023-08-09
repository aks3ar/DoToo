import {
  requestClear,
  requestTodoDetails,
  requestTodoDelete,
  requestTodoCreate,
  // requestTodoUpdate,
  requestTodoList,
  // requestTodoBulk
} from './helperTest';

import {
  TodoStatuses
} from './interface';

const OK = 200;
const ERROR = { error: expect.any(String) };

let todoItemIdObj: any;
let todoDetailsObj: any;
// let todoItemIdObj2: any;
// let todoItemIdObj3: any;
// let todoItemIdObj4: any;

describe('requestTodoDetails Tests', () => {
  beforeEach(() => {
    requestClear();
    todoItemIdObj = requestTodoCreate('description', null);
  });
  test('All Correct', () => {
    const res = requestTodoDetails(todoItemIdObj.returnBody.todoItemId);
    expect(res.statusCode).toStrictEqual(OK);
    expect(res.returnBody).toStrictEqual(
      {
        description: 'description',
        parentId: null,
        score: 'NA',
        status: 'TODO',
        tagIds: []
      }
    );
  });
  test('todoItemId does not exist', () => {
    const res = requestTodoDetails(-1);
    expect(res.statusCode).toStrictEqual(400);
    expect(res.returnBody).toStrictEqual(ERROR);
  });
});

describe('requestTodoDelete Tests', () => {
  beforeEach(() => {
    requestClear();
    todoItemIdObj = requestTodoCreate('description', null);
    todoDetailsObj = requestTodoDetails(todoItemIdObj.returnBody.todoItemId);
    // todoItemIdObj2 = requestTodoCreate('description2', todoItemIdObj.returnBody.todoItemId);
    // todoItemIdObj3 = requestTodoCreate('description3', todoItemIdObj2.returnBody.todoItemId);
    // todoItemIdObj4 = requestTodoCreate('description4', todoItemIdObj2.returnBody.todoItemId);
  });
  test('All Correct', () => {
    requestTodoDelete(todoItemIdObj.returnBody.todoItemId);
    const res = requestTodoDetails(todoItemIdObj.returnBody.todoItemId);
    expect(res.statusCode).toStrictEqual(400);
    expect(res.returnBody).toStrictEqual(ERROR);
  });
  test('todoItemId does not exist', () => {
    const res = requestTodoDelete(-1);
    expect(res.statusCode).toStrictEqual(400);
    expect(res.returnBody).toStrictEqual(ERROR);
  });
});

describe('requestTodoCreate Tests', () => {
  beforeEach(() => {
    requestClear();
  });
  describe('All Correct', () => {
    test('null parent', () => {
      const res = requestTodoCreate('description', null);
      expect(res.statusCode).toStrictEqual(OK);
      expect(res.returnBody).toStrictEqual({ todoItemId: expect.any(Number) });
    });
    test('not null parent', () => {
      requestTodoCreate('description', null);
      todoItemIdObj = requestTodoCreate('description', null);
      const res = requestTodoCreate('descriptions', todoItemIdObj.returnBody.todoItemId);
      expect(res.statusCode).toStrictEqual(OK);
      expect(res.returnBody).toStrictEqual({ todoItemId: expect.any(Number) });
    });
  });
  test.skip('There are already 50 todo items generated', () => {
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
  test('parentId does not refer to a different, existing todo item.', () => {
    const res = requestTodoCreate('description', -1);
    expect(res.statusCode).toStrictEqual(400);
    expect(res.returnBody).toStrictEqual(ERROR);
  });
  test('A todo item of this description, that shares a common immediate parent task (or a null parent), already exists.', () => {
    todoItemIdObj = requestTodoCreate('description', null);
    todoDetailsObj = requestTodoDetails(todoItemIdObj.returnBody.todoItemId);
    const res = requestTodoCreate(todoDetailsObj.returnBody.description, todoItemIdObj.returnBody.todoItemId);
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

describe('requestTodoList Tests', () => {
  beforeEach(() => {
    requestClear();
    todoItemIdObj = requestTodoCreate('description', null);
    // todoItemIdObj2 = requestTodoCreate('description1', todoItemIdObj.returnBody.todoItemId);
    todoDetailsObj = requestTodoDetails(todoItemIdObj.returnBody.todoItemId);
  });
  describe('All Correct', () => {
    // beforeEach(() => {});
    test('not a null parent', () => {
      const res = requestTodoList(todoItemIdObj.returnBody.todoItemId, undefined, undefined);
      expect(res.statusCode).toStrictEqual(OK);
      expect(res.returnBody).toStrictEqual({
        todoItems: [
          {
            description: todoDetailsObj.returnBody.description,
            parentId: todoDetailsObj.returnBody.parentId,
            score: todoDetailsObj.returnBody.score,
            status: todoDetailsObj.returnBody.status,
            tagIds: todoDetailsObj.returnBody.tagIds,
          },
        ],
      });
    });
    test.skip('null parents', () => {
      const res = requestTodoList(null);
      expect(res.statusCode).toStrictEqual(OK);
      expect(res.returnBody).toStrictEqual({});
    });
    test.skip('parents and tagIds', () => {
      // requestTagCreate('Tag1');
      // tagListObj = requestTagList();
      // const firstTag = tagListObj.returnBody.tags[0];
      // firstTagId = firstTag.tagId;
      const res = requestTodoList(todoItemIdObj.returnBody.todoItemId, [], undefined);
      expect(res.statusCode).toStrictEqual(OK);
      expect(res.returnBody).toStrictEqual({});
    });
    test('parents and status', () => {
      const res = requestTodoList(todoItemIdObj.returnBody.todoItemId, undefined, TodoStatuses.TODO);
      expect(res.statusCode).toStrictEqual(OK);
      expect(res.returnBody).toStrictEqual({
        todoItems: [
          {
            description: todoDetailsObj.returnBody.description,
            parentId: todoDetailsObj.returnBody.parentId,
            score: todoDetailsObj.returnBody.score,
            status: todoDetailsObj.returnBody.status,
            tagIds: todoDetailsObj.returnBody.tagIds,
          },
        ],
      });
    });
  });
  test('status is not a valid status', () => {
    const invalidStatus = 'INVALID_STATUS' as TodoStatuses;
    const res = requestTodoList(todoItemIdObj.returnBody.todoItemId, [], invalidStatus);
    expect(res.statusCode).toStrictEqual(400);
    expect(res.returnBody).toStrictEqual(ERROR);
  });
  test.skip('tagIds is an empty list', () => {
    const res = requestTodoList(todoItemIdObj.returnBody.todoItemId, [], undefined);
    expect(res.statusCode).toStrictEqual(400);
    expect(res.returnBody).toStrictEqual('ERROR');
  });
  test.skip('tagIds contains any invalid tagId', () => {
    const res = requestTodoList(todoItemIdObj.returnBody.todoItemId, [], undefined);
    expect(res.statusCode).toStrictEqual(400);
    expect(res.returnBody).toStrictEqual('ERROR');
  });
  test('parentId does not refer to a valid todo item', () => {
    const res = requestTodoList(-1, [], undefined);
    expect(res.statusCode).toStrictEqual(400);
    expect(res.returnBody).toStrictEqual(ERROR);
  });
});

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
