import { generateLinkedList } from './index';

const values1 = [1, 2, 3, 4, 5, 6, 7];
const values2 = [9, 2, 9, 4, 5, 9, 7];

describe('generateLinkedList', () => {
  test('should generate linked list from values 1', () => {
    expect(generateLinkedList(values1)).toStrictEqual({
      next: {
        next: {
          next: {
            next: {
              next: {
                next: {
                  next: {
                    next: null,
                    value: null,
                  },
                  value: 7,
                },
                value: 6,
              },
              value: 5,
            },
            value: 4,
          },
          value: 3,
        },
        value: 2,
      },
      value: 1,
    });
  });

  test('should generate linked list from values 2', () => {
    expect(generateLinkedList(values2)).toMatchSnapshot();
  });
});
