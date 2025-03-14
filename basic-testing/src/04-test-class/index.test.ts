import { getBankAccount } from '.';
import _ from 'lodash';

describe('BankAccount', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should create account with initial balance', () => {
    const BankAcc = getBankAccount(123);
    expect(BankAcc.getBalance()).toBe(123);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const BankAcc = getBankAccount(123);
    expect(() => BankAcc.withdraw(1233)).toThrow(
      `Insufficient funds: cannot withdraw more than ${BankAcc.getBalance()}`,
    );
  });

  test('should throw error when transferring more than balance', () => {
    const BankAcc1 = getBankAccount(123);
    const BankAcc2 = getBankAccount(321);
    expect(() => BankAcc1.transfer(1233, BankAcc2)).toThrow(
      `Insufficient funds: cannot withdraw more than ${BankAcc1.getBalance()}`,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const BankAcc1 = getBankAccount(123);
    expect(() => BankAcc1.transfer(12, BankAcc1)).toThrow(`Transfer failed`);
  });

  test('should deposit money', () => {
    const BankAcc = getBankAccount(123);
    BankAcc.deposit(123);
    expect(BankAcc.getBalance()).toBe(246);
  });

  test('should withdraw money', () => {
    const BankAcc = getBankAccount(123);
    BankAcc.withdraw(123);
    expect(BankAcc.getBalance()).toBe(0);
  });

  test('should transfer money', () => {
    const BankAcc1 = getBankAccount(123);
    const BankAcc2 = getBankAccount(123);
    BankAcc1.transfer(123, BankAcc2);
    expect(BankAcc2.getBalance()).toBe(246);
    expect(BankAcc1.getBalance()).toBe(0);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const originalRandom = _.random;
    const mockRandom = (min: number, max: number, flag: boolean) => {
      if (min < 1) min = 1;
      if (max < 1) max = 1;
      return originalRandom(min, max, flag);
    };
    jest.spyOn(_, 'random').mockImplementation(<jest.Mock>mockRandom);
    const BankAcc = getBankAccount(123);
    await expect(BankAcc.fetchBalance()).resolves.toEqual(expect.any(Number));
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const BankAcc = getBankAccount(123);
    jest.spyOn(BankAcc, 'fetchBalance').mockReturnValue(Promise.resolve(42));
    await BankAcc.synchronizeBalance();
    expect(BankAcc.getBalance()).toBe(42);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(_, 'random').mockReturnValue(0);
    const BankAcc = getBankAccount(123);
    expect(BankAcc.synchronizeBalance()).rejects.toThrow(
      'Synchronization failed',
    );
  });
});
