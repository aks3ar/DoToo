import {
  requestClear,
  requestTagList,
  requestTagCreate
} from './helperTest';

const OK = 200;

describe('requestTagList Tests', () => {
  beforeEach(() => {
    requestTagCreate('Tag1');
    requestTagCreate('Tag2');
    requestClear();
  });
  test('All Correct', () => {
    const res = requestTagList();
    expect(res.statusCode).toStrictEqual(OK);
    expect(res.returnBody).toStrictEqual(
      {
        tags: []
      }
    );
  });
});
