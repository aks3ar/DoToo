import {
  requestClear,
  requestTodoDetails,
  requestTodoDelete,
  requestTodoCreate,
  requestTodoUpdate,
  requestTodoList,
  requestTagCreate,
  requestTagList,
  // requestTodoBulk
} from './helperTest';

const OK = 200;
const ERROR = { error: expect.any(String) };

let todoItemIdObj: any;
let todoDetailsObj: any;
let todoItemIdObj2: any;
let todoItemIdObj3: any;
let todoItemIdObj4: any;
let tagListObj: any;
let firstTagId: any;

describe('requestTodoDetails Tests', () => {
  beforeEach(() => {
    requestClear();
    todoItemIdObj = requestTodoCreate('description', 'null');
  });
  test('All Correct', () => {
    const res = requestTodoDetails(todoItemIdObj.returnBody.todoItemId);
    expect(res.statusCode).toStrictEqual(OK);
    expect(res.returnBody).toStrictEqual(
      {
        description: 'description',
        parentId: 'null',
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
    todoItemIdObj = requestTodoCreate('description', 'null');
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
      const res = requestTodoCreate('description', 'null');
      expect(res.statusCode).toStrictEqual(OK);
      expect(res.returnBody).toStrictEqual({ todoItemId: expect.any(Number) });
    });
    test('not null parent', () => {
      requestTodoCreate('description', 'null');
      todoItemIdObj = requestTodoCreate('description', 'null');
      const res = requestTodoCreate('descriptions', todoItemIdObj.returnBody.todoItemId);
      expect(res.statusCode).toStrictEqual(OK);
      expect(res.returnBody).toStrictEqual({ todoItemId: expect.any(Number) });
    });
  });
  test('There are already 50 todo items generated', () => {
    for (let i = 0; i < 51; i++) {
      requestTodoCreate(`Todo ${i}`, 'null');
    }
    const res = requestTodoCreate('description', 'null');
    expect(res.statusCode).toStrictEqual(400);
    expect(res.returnBody).toStrictEqual(ERROR);
  });
  test('Description is less than 1 character', () => {
    const res = requestTodoCreate('', 'null');
    expect(res.statusCode).toStrictEqual(400);
    expect(res.returnBody).toStrictEqual(ERROR);
  });
  test('parentId does not refer to a different, existing todo item.', () => {
    const res = requestTodoCreate('description', -1);
    expect(res.statusCode).toStrictEqual(400);
    expect(res.returnBody).toStrictEqual(ERROR);
  });
  test('A todo item of this description, that shares a common immediate parent task (or a null parent), already exists.', () => {
    todoItemIdObj = requestTodoCreate('description', 'null');
    todoDetailsObj = requestTodoDetails(todoItemIdObj.returnBody.todoItemId);
    const res = requestTodoCreate(todoDetailsObj.returnBody.description, todoItemIdObj.returnBody.todoItemId);
    expect(res.statusCode).toStrictEqual(400);
    expect(res.returnBody).toStrictEqual(ERROR);
  });
});

describe('requestTodoUpdate Tests', () => {
  beforeEach(() => {
    requestClear();
    todoItemIdObj = requestTodoCreate('description', 'null');
    todoDetailsObj = requestTodoDetails(todoItemIdObj.returnBody.todoItemId);
    requestTagCreate('Tag1');
    tagListObj = requestTagList();
    const firstTag = tagListObj.returnBody.tags[0];
    firstTagId = firstTag.tagId;
  });
  describe('All Correct', () => {
    beforeEach(() => {
      requestTodoUpdate(todoItemIdObj.returnBody.todoItemId, 'description', [firstTagId], 'DONE', 'null', 1750000000);
    });
    test('score = high', () => {
      const resDetails = requestTodoDetails(todoItemIdObj.returnBody.todoItemId);
      expect(resDetails.statusCode).toStrictEqual(OK);
      expect(resDetails.returnBody).toStrictEqual(
        {
          description: 'description',
          parentId: 'null',
          score: 'HIGH',
          status: 'DONE',
          tagIds: [firstTagId],
        }
      );
    });
    test('score = high (no deadline)', () => {
      requestTodoUpdate(todoItemIdObj.returnBody.todoItemId, 'description', [firstTagId], 'DONE', 'null', null);
      const resAfter = requestTodoDetails(todoItemIdObj.returnBody.todoItemId);
      expect(resAfter.statusCode).toStrictEqual(OK);
      expect(resAfter.returnBody).toStrictEqual({
        description: 'description',
        parentId: 'null',
        score: 'HIGH',
        status: 'DONE',
        tagIds: [firstTagId],
      });
    });
  });
  test('score = low', () => {
    requestTodoUpdate(todoItemIdObj.returnBody.todoItemId, 'description', [firstTagId], 'DONE', 'null', 1);
    const resDetails = requestTodoDetails(todoItemIdObj.returnBody.todoItemId);
    expect(resDetails.statusCode).toStrictEqual(OK);
    expect(resDetails.returnBody).toStrictEqual(
      {
        description: 'description',
        parentId: 'null',
        score: 'LOW',
        status: 'DONE',
        tagIds: [firstTagId],
      }
    );
  });

  test('todoItemId is not valid', () => {
    const res = requestTodoUpdate('asd', 'description', [firstTagId], 'TODO', 'null', 1750000000);
    expect(res.statusCode).toStrictEqual(400);
    expect(res.returnBody).toStrictEqual(ERROR);
    const resDetails = requestTodoDetails(todoItemIdObj.returnBody.todoItemId);
    expect(resDetails.statusCode).toStrictEqual(200);
    expect(resDetails.returnBody).toStrictEqual(todoDetailsObj.returnBody);
  });
  test('Description is less than 1 character', () => {
    const res = requestTodoUpdate(todoItemIdObj.returnBody.todoItemId, '', [firstTagId], 'TODO', 'null', 1750000000);
    expect(res.statusCode).toStrictEqual(400);
    expect(res.returnBody).toStrictEqual(ERROR);
    const resDetails = requestTodoDetails(todoItemIdObj.returnBody.todoItemId);
    expect(resDetails.statusCode).toStrictEqual(200);
    expect(resDetails.returnBody).toStrictEqual(todoDetailsObj.returnBody);
  });
  test('A todo item of this description, that shares a common immediate parent task (or a null parent), already exists', () => {
    todoItemIdObj2 = requestTodoCreate('description1', todoItemIdObj.returnBody.todoItemId);
    const res = requestTodoUpdate(todoItemIdObj2.returnBody.todoItemId, 'description', [firstTagId], 'TODO', todoItemIdObj.returnBody.todoItemId, 1750000000);
    expect(res.statusCode).toStrictEqual(400);
    expect(res.returnBody).toStrictEqual(ERROR);
    const resDetails = requestTodoDetails(todoItemIdObj.returnBody.todoItemId);
    expect(resDetails.statusCode).toStrictEqual(200);
    expect(resDetails.returnBody).toStrictEqual(todoDetailsObj.returnBody);
  });
  test('status is not a valid enum of statuses', () => {
    const res = requestTodoUpdate(todoItemIdObj.returnBody.todoItemId, 'description', [firstTagId], 'invalidStatus', 'null', 1750000000);
    expect(res.statusCode).toStrictEqual(400);
    expect(res.returnBody).toStrictEqual(ERROR);
    const resDetails = requestTodoDetails(todoItemIdObj.returnBody.todoItemId);
    expect(resDetails.statusCode).toStrictEqual(200);
    expect(resDetails.returnBody).toStrictEqual(todoDetailsObj.returnBody);
  });
  test('tagIds contains any invalid tagIds', () => {
    const res = requestTodoUpdate(todoItemIdObj.returnBody.todoItemId, 'description', [-1], 'TODO', 'null', 1750000000);
    expect(res.statusCode).toStrictEqual(400);
    expect(res.returnBody).toStrictEqual(ERROR);
    const resDetails = requestTodoDetails(todoItemIdObj.returnBody.todoItemId);
    expect(resDetails.statusCode).toStrictEqual(200);
    expect(resDetails.returnBody).toStrictEqual(todoDetailsObj.returnBody);
  });
  test('parentId refers to this todo list items ID', () => {
    const res = requestTodoUpdate(todoItemIdObj.returnBody.todoItemId, 'description', [firstTagId], 'TODO', todoItemIdObj.returnBody.todoItemId, 1750000000);
    expect(res.statusCode).toStrictEqual(400);
    expect(res.returnBody).toStrictEqual(ERROR);
    const resDetails = requestTodoDetails(todoItemIdObj.returnBody.todoItemId);
    expect(resDetails.statusCode).toStrictEqual(200);
    expect(resDetails.returnBody).toStrictEqual(todoDetailsObj.returnBody);
  });
  test('parentId is not null and does not refer to an exiting todoItemId', () => {
    todoItemIdObj2 = requestTodoCreate('description1', todoItemIdObj.returnBody.todoItemId);
    const res = requestTodoUpdate(todoItemIdObj2.returnBody.todoItemId, 'description', [firstTagId], 'TODO', -1, 1750000000);
    expect(res.statusCode).toStrictEqual(400);
    expect(res.returnBody).toStrictEqual(ERROR);
    const resDetails = requestTodoDetails(todoItemIdObj.returnBody.todoItemId);
    expect(resDetails.statusCode).toStrictEqual(200);
    expect(resDetails.returnBody).toStrictEqual(todoDetailsObj.returnBody);
  });
  test('parentId would create a cycle in the todo list structure', () => {
    todoItemIdObj2 = requestTodoCreate('description2', 'null');
    todoItemIdObj3 = requestTodoCreate('description3', 'null');
    todoItemIdObj4 = requestTodoCreate('description4', 'null');
    requestTodoUpdate(todoItemIdObj2.returnBody.todoItemId, 'description2', [firstTagId], 'DONE', todoItemIdObj.returnBody.todoItemId, 1750000000);
    requestTodoUpdate(todoItemIdObj3.returnBody.todoItemId, 'description3', [firstTagId], 'DONE', todoItemIdObj2.returnBody.todoItemId, 1750000000);
    requestTodoUpdate(todoItemIdObj4.returnBody.todoItemId, 'description4', [firstTagId], 'DONE', todoItemIdObj3.returnBody.todoItemId, 1750000000);
    const res = requestTodoUpdate(todoItemIdObj2.returnBody.todoItemId, 'description2', [firstTagId], 'DONE', todoItemIdObj4.returnBody.todoItemId, 1750000000);
    expect(res.statusCode).toStrictEqual(400);
    expect(res.returnBody).toStrictEqual(ERROR);
  });
  test('deadline is not null and is not a valid unix timestamp', () => {
    const res = requestTodoUpdate(todoItemIdObj.returnBody.todoItemId, 'description', [firstTagId], 'TODO', 'null', -1);
    expect(res.statusCode).toStrictEqual(400);
    expect(res.returnBody).toStrictEqual(ERROR);
    const resDetails = requestTodoDetails(todoItemIdObj.returnBody.todoItemId);
    expect(resDetails.statusCode).toStrictEqual(200);
    expect(resDetails.returnBody).toStrictEqual(todoDetailsObj.returnBody);
  });
});

describe('requestTodoList Tests', () => {
  beforeEach(() => {
    requestClear();
    todoItemIdObj = requestTodoCreate('description', 'null');
    todoItemIdObj2 = requestTodoCreate('description2', 'null');
    todoItemIdObj3 = requestTodoCreate('description3', todoItemIdObj2.returnBody.todoItemId);
  });
  describe('All Correct', () => {
    test('not a null parent', () => {
      const res = requestTodoList(todoItemIdObj2.returnBody.todoItemId);
      expect(res.statusCode).toStrictEqual(OK);
      expect(res.returnBody).toStrictEqual({
        todoItems: [
          {
            description: 'description3',
            parentId: todoItemIdObj2.returnBody.todoItemId,
            score: 'NA',
            status: 'TODO',
            tagIds: [],
          },
        ],
      });
    });
    test('null parents', () => {
      const res = requestTodoList('null');
      expect(res.statusCode).toStrictEqual(OK);
      expect(res.returnBody).toStrictEqual(
        {
          todoItems: [
            {
              description: 'description2',
              parentId: 'null',
              score: 'NA',
              status: 'TODO',
              tagIds: [],
            },
            {
              description: 'description',
              parentId: 'null',
              score: 'NA',
              status: 'TODO',
              tagIds: [],
            },
          ],
        });
    });
    test('parents and tagIds', () => {
      requestTagCreate('Tag1');
      tagListObj = requestTagList();
      const firstTag = tagListObj.returnBody.tags[0];
      firstTagId = firstTag.tagId;
      requestTodoUpdate(todoItemIdObj.returnBody.todoItemId, 'description', [firstTagId], 'TODO', 'null', 1750000000);
      const res = requestTodoList(todoItemIdObj2.returnBody.todoItemId, [firstTagId]);
      expect(res.statusCode).toStrictEqual(OK);
      expect(res.returnBody).toStrictEqual(
        {
          todoItems: [
            {
              description: 'description3',
              parentId: todoItemIdObj2.returnBody.todoItemId,
              score: 'NA',
              status: 'TODO',
              tagIds: [],
            },
            {
              description: 'description',
              parentId: 'null',
              score: 'NA',
              status: 'TODO',
              tagIds: [firstTagId],
            },
          ],
        });
    });
    test('parents and status', () => {
      requestTodoUpdate(todoItemIdObj.returnBody.todoItemId, 'description', [], 'INPROGRESS', 'null', 1750000000);
      const res = requestTodoList(todoItemIdObj2.returnBody.todoItemId, null, 'INPROGRESS');
      expect(res.statusCode).toStrictEqual(OK);
      expect(res.returnBody).toStrictEqual(
        {
          todoItems: [
            {
              description: 'description3',
              parentId: todoItemIdObj2.returnBody.todoItemId,
              score: 'NA',
              status: 'TODO',
              tagIds: [],
            },
            {
              description: 'description',
              parentId: 'null',
              score: 'NA',
              status: 'INPROGRESS',
              tagIds: [],
            },
          ],
        });
    });
  });
  test('status is not a valid status', () => {
    const res = requestTodoList(todoItemIdObj.returnBody.todoItemId, [], 'invalidStatus');
    expect(res.statusCode).toStrictEqual(400);
    expect(res.returnBody).toStrictEqual(ERROR);
  });
  test('tagIds is an empty list', () => {
    const res = requestTodoList(todoItemIdObj.returnBody.todoItemId, [], undefined);
    expect(res.statusCode).toStrictEqual(400);
    expect(res.returnBody).toStrictEqual(ERROR);
  });
  test('tagIds contains any invalid tagId', () => {
    const res = requestTodoList(todoItemIdObj.returnBody.todoItemId, [-1], undefined);
    expect(res.statusCode).toStrictEqual(400);
    expect(res.returnBody).toStrictEqual(ERROR);
  });
  test('parentId does not refer to a valid todo item', () => {
    const res = requestTodoList(-1, [], undefined);
    expect(res.statusCode).toStrictEqual(400);
    expect(res.returnBody).toStrictEqual(ERROR);
  });
});
