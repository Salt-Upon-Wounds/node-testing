import { mockOne, mockTwo, mockThree, unmockedFunction } from './index';

jest.mock('./index', () => {
  const originalModule = jest.requireActual('./index');
  return {
    mockOne: jest.fn(),
    mockTwo: jest.fn(),
    mockThree: jest.fn(),
    unmockedFunction: originalModule.unmockedFunction,
  };
});

describe('partial mocking', () => {
  afterAll(() => {
    jest.unmock('./index');
  });

  test('mockOne, mockTwo, mockThree should not log into console', () => {
    const spy = jest.spyOn(console, 'log');
    mockOne();
    mockTwo();
    mockThree();
    expect(spy).not.toHaveBeenCalled();
  });

  test('unmockedFunction should log into console', () => {
    const spy = jest.spyOn(console, 'log');
    unmockedFunction();
    expect(spy).toHaveBeenCalled();
  });
});
