import path from 'path';
import fsPromises from 'fs/promises';
import fs from 'fs';
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    jest.spyOn(global, 'setTimeout');
    const callback = jest.fn();
    doStuffByTimeout(callback, 10000);
    expect(setTimeout).toHaveBeenLastCalledWith(callback, 10000);
  });

  test('should call callback only after timeout', () => {
    jest.spyOn(global, 'setTimeout');
    const callback = jest.fn();
    doStuffByTimeout(callback, 10000);
    expect(callback).not.toBeCalled();
    jest.runAllTimers();
    expect(callback).toBeCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    jest.spyOn(global, 'setInterval');
    const callback = jest.fn();
    doStuffByInterval(callback, 10000);
    expect(setInterval).toHaveBeenLastCalledWith(callback, 10000);
  });

  test('should call callback multiple times after multiple intervals', () => {
    jest.spyOn(global, 'setInterval');
    const callback = jest.fn();
    doStuffByInterval(callback, 10000);
    expect(callback).not.toBeCalled();
    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();
    jest.runOnlyPendingTimers();
    expect(callback).toBeCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  const pathToFile = 'file';

  beforeEach(() => {
    const mockJoin = (...paths: string[]) => {
      return paths[1] === pathToFile ? pathToFile : null;
    };
    const mockExistsSync = (path: string): boolean => {
      return path === pathToFile;
    };
    const mockReadFile = () => {
      return Promise.resolve('file content');
    };
    jest.spyOn(path, 'join').mockImplementation(<jest.Mock>mockJoin);
    jest
      .spyOn(fsPromises, 'readFile')
      .mockImplementation(<jest.Mock>mockReadFile);
    jest.spyOn(fs, 'existsSync').mockImplementation(<jest.Mock>mockExistsSync);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should call join with pathToFile', async () => {
    await readFileAsynchronously(pathToFile);
    expect(path.join).toHaveBeenCalledWith(__dirname, pathToFile);
  });

  test('should return null if file does not exist', async () => {
    const result = await readFileAsynchronously(pathToFile + 'asd');
    expect(result).toBe(null);
  });

  test('should return file content if file exists', async () => {
    const result = await readFileAsynchronously(pathToFile);
    expect(result).toBe('file content');
  });
});
