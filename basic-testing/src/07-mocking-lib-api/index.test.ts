import axios from 'axios';
import _ from 'lodash';
import { throttledGetDataFromApi } from './index';

jest.mock('lodash', () => ({
  throttle: jest.fn((fn) => {
    return fn;
  }),
}));
jest.mock('axios');
const dummy = '/somepath';

describe('throttledGetDataFromApi', () => {
  beforeEach(() => {
    const mockCreate = () => ({
      get: jest.fn().mockResolvedValue({ data: dummy }),
    });
    jest.spyOn(axios, 'create').mockImplementation(<jest.Mock>mockCreate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should create instance with provided base url', async () => {
    await throttledGetDataFromApi(dummy);

    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: 'https://jsonplaceholder.typicode.com',
      }),
    );
  });

  test('should perform request to correct provided url', async () => {
    await throttledGetDataFromApi(dummy);
    expect(
      (axios.create as jest.Mock).mock.results[0]?.value.get,
    ).toHaveBeenCalledWith(dummy);
  });

  test('should return response data', async () => {
    expect(throttledGetDataFromApi(dummy)).resolves.toBe(dummy);
  });
});
