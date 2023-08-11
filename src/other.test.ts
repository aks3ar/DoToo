import {
  requestClear,
  requestTodoCreate,
  requestSummary,
  requestTodoUpdate
} from './helperTest';

const OK = 200;
const ERROR = { error: expect.any(String) };

let todoItemIdObj: any;

describe('requestSummary Tests', () => {
  beforeEach(() => {
    requestClear();
    for (let i = 0; i < 15; i++) {
      requestTodoCreate(`Todo ${i}`, 'null');
      todoItemIdObj = requestTodoCreate(`Todo ${i}`, 'null');
      requestTodoUpdate(todoItemIdObj.returnBody.todoItemId, `Todo ${i}`, [], 'DONE', 'null', 1750000000);
    }
  });
  test('All Correct - null', () => {
    const res = requestSummary('null');
    expect(res.statusCode).toStrictEqual(OK);
    expect(res.returnBody).toStrictEqual(
      {
        todoItemIds: [
          expect.any(Number),
          expect.any(Number),
          expect.any(Number),
          expect.any(Number),
          expect.any(Number),
          expect.any(Number),
          expect.any(Number),
          expect.any(Number),
          expect.any(Number),
          expect.any(Number),
        ],
      }
    );
  });
  test('All Correct - 1', () => {
    const res = requestSummary(1);
    expect(res.statusCode).toStrictEqual(OK);
    expect(res.returnBody).toStrictEqual(
      {
        todoItemIds: [
          expect.any(Number),
          expect.any(Number),
          expect.any(Number),
          expect.any(Number),
          expect.any(Number),
        ],
      }
    );
  });

  test('Step is not one of { null, 1, 2, 3, 4 }', () => {
    const res = requestSummary(-1);
    expect(res.statusCode).toStrictEqual(400);
    expect(res.returnBody).toStrictEqual(ERROR);
  });
});
