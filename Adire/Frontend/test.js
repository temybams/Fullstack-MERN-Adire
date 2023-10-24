/* eslint-disable no-undef */
// test.js

function add(a, b) {
  return a + b;
}

test('Adding 2 + 3 should equal 5', () => {
  const result = add(2, 3);
  expect(result).toBe(5);
});

test('Adding non-numeric inputs should return concatenated string', () => {
  const result = add('abc', 'def');
  expect(result).toBe('abcdef');
});
