import {
  throwError,
  throwCustomError,
  resolveValue,
  MyAwesomeError,
  rejectCustomError,
} from './index';

describe('resolveValue', () => {
  test('should resolve provided value', async () => {
    return expect(resolveValue(1)).resolves.toBe(1);
  });
});

describe('throwError', () => {
  test('should throw error with provided message', () => {
    expect(() => throwError('provided message')).toThrow('provided message');
  });

  test('should throw error with default message if message is not provided', () => {
    expect(throwError).toThrow('Oops');
  });
});

describe('throwCustomError', () => {
  test('should throw custom error', () => {
    expect(throwCustomError).toThrow(MyAwesomeError);
  });
});

describe('rejectCustomError', () => {
  test('should reject custom error', async () => {
    return expect(rejectCustomError).rejects.toThrow(MyAwesomeError);
  });
});
