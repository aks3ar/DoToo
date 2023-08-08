import {
  requestClear,
  // requestTagList,
  // requestTagName,
  // requestTagDelete,
  requestTagCreate
} from './helperTest';

const OK = 200;
const ERROR = { error: expect.any(String) };

// describe('requestTagList Tests', () => {
//   beforeEach(() => {
//     requestClear();
//   });
//   test('All Correct', () => {
//     const res = requestTagList();
//     expect(res.statusCode).toStrictEqual(OK);
//     expect(res.returnBody).toStrictEqual();
//   });
//   test('Token is not a valid structure', () => {
//     const res = requestTagList();
//     expect(res.statusCode).toStrictEqual(400);
//     expect(res.returnBody).toStrictEqual(ERROR);
//   });
//   test('Provided token is valid structure, but is not for a currently logged in session', () => {
//     const res = requestTagList();
//     expect(res.statusCode).toStrictEqual(400);
//     expect(res.returnBody).toStrictEqual(ERROR);
//   });
// });

// describe('requestTagName Tests', () => {
//   beforeEach(() => {
//     requestClear();
//   });
//   test('All Correct', () => {
//     const res = requestTagList();
//     expect(res.statusCode).toStrictEqual(OK);
//     expect(res.returnBody).toStrictEqual();
//   });
//   test('Token is not a valid structure', () => {
//     const res = requestTagList();
//     expect(res.statusCode).toStrictEqual(400);
//     expect(res.returnBody).toStrictEqual(ERROR);
//   });
//   test('Provided token is valid structure, but is not for a currently logged in session', () => {
//     const res = requestTagList();
//     expect(res.statusCode).toStrictEqual(400);
//     expect(res.returnBody).toStrictEqual(ERROR);
//   });
// });

// describe('requestTagDelete Tests', () => {
//   beforeEach(() => {
//     requestClear();
//   });
//   test('All Correct', () => {
//     const res = requestTagList();
//     expect(res.statusCode).toStrictEqual(OK);
//     expect(res.returnBody).toStrictEqual();
//   });
//   test('Token is not a valid structure', () => {
//     const res = requestTagList();
//     expect(res.statusCode).toStrictEqual(400);
//     expect(res.returnBody).toStrictEqual(ERROR);
//   });
//   test('Provided token is valid structure, but is not for a currently logged in session', () => {
//     const res = requestTagList();
//     expect(res.statusCode).toStrictEqual(400);
//     expect(res.returnBody).toStrictEqual(ERROR);
//   });
// });

describe('requestTagCreate Tests', () => {
  beforeEach(() => {
    requestClear();
  });
  test('All Correct', () => {
    const res = requestTagCreate('TagName');
    expect(res.statusCode).toStrictEqual(OK);
    // expect(res.returnBody).toStrictEqual("ERROR");
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
