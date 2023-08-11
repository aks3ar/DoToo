import {
  requestClear,
  requestTagList,
  requestTagName,
  requestTagDelete,
  requestTagCreate
} from './helperTest';

const OK = 200;
const ERROR = { error: expect.any(String) };

let tagListObj: any;
let firstTagId: any;

describe('requestTagList Tests', () => {
  beforeEach(() => {
    requestClear();
    requestTagCreate('Tag1');
    requestTagCreate('Tag2');
  });
  test('All Correct', () => {
    const res = requestTagList();
    expect(res.statusCode).toStrictEqual(OK);
    expect(res.returnBody).toStrictEqual(
      {
        tags: [
          {
            name: 'Tag1',
            tagId: expect.any(Number)
          },
          {
            name: 'Tag2',
            tagId: expect.any(Number)
          }
        ]
      }
    );
  });
});

describe('requestTagName Tests', () => {
  beforeEach(() => {
    requestClear();
    requestTagCreate('Tag1');
    tagListObj = requestTagList();
    const firstTag = tagListObj.returnBody.tags[0];
    firstTagId = firstTag.tagId;
  });
  test('All Correct', () => {
    const res = requestTagName(firstTagId);
    expect(res.statusCode).toStrictEqual(OK);
    expect(res.returnBody).toStrictEqual({ name: 'Tag1' });
  });
  test('tagId does not exist', () => {
    const res = requestTagName(-1);
    expect(res.statusCode).toStrictEqual(400);
    expect(res.returnBody).toStrictEqual(ERROR);
  });
});

describe('requestTagDelete Tests', () => {
  beforeEach(() => {
    requestClear();
  });
  describe('All Correct', () => {
    beforeEach(() => {
      requestTagCreate('Tag1');
      requestTagCreate('Tag2');
      tagListObj = requestTagList();
      const firstTag = tagListObj.returnBody.tags[0];
      firstTagId = firstTag.tagId;
    });
    test('requestTagDelete Check', () => {
      const res = requestTagDelete(firstTagId);
      expect(res.statusCode).toStrictEqual(OK);
      expect(res.returnBody).toStrictEqual({});
    });
    test('requestTagList Check', () => {
      requestTagDelete(firstTagId);
      const res = requestTagList();
      expect(res.statusCode).toStrictEqual(OK);
      expect(res.returnBody).toStrictEqual(
        {
          tags: [
            {
              name: 'Tag2',
              tagId: expect.any(Number)
            }
          ]
        }
      );
    });
  });
  test('tagId does not exist', () => {
    const res = requestTagDelete(-1);
    expect(res.statusCode).toStrictEqual(400);
    expect(res.returnBody).toStrictEqual(ERROR);
  });
});

describe('requestTagCreate Tests', () => {
  beforeEach(() => {
    requestClear();
  });
  test('All Correct', () => {
    const res = requestTagCreate('TagName');
    expect(res.statusCode).toStrictEqual(OK);
    expect(res.returnBody).toStrictEqual({ tagId: expect.any(Number) });
  });
  test('name is shorter than 1 character', () => {
    const res = requestTagCreate('');
    expect(res.statusCode).toStrictEqual(400);
    expect(res.returnBody).toStrictEqual(ERROR);
  });
  test('name is longer than 10 characters', () => {
    const res = requestTagCreate('pneumonoultramicroscopicsilicovolcanoconiosis');
    expect(res.statusCode).toStrictEqual(400);
    expect(res.returnBody).toStrictEqual(ERROR);
  });
  test('a tag with this name already exists (comparisons are case insensitive)', () => {
    requestTagCreate('TagName');
    const res = requestTagCreate('TagName');
    expect(res.statusCode).toStrictEqual(400);
    expect(res.returnBody).toStrictEqual(ERROR);
  });
});
