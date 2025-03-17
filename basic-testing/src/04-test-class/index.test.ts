import { BankAccount, getBankAccount } from '.';
import _ from 'lodash';

let BankAcc1: BankAccount;
let BankAcc2: BankAccount;

describe('BankAccount', () => {
  beforeEach(() => {
    BankAcc1 = getBankAccount(123);
    BankAcc2 = getBankAccount(321);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should create account with initial balance', () => {
    expect(BankAcc1.getBalance()).toBe(123);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    expect(() => BankAcc1.withdraw(1233)).toThrow(
      `Insufficient funds: cannot withdraw more than ${BankAcc1.getBalance()}`,
    );
  });

  test('should throw error when transferring more than balance', () => {
    expect(() => BankAcc1.transfer(1233, BankAcc2)).toThrow(
      `Insufficient funds: cannot withdraw more than ${BankAcc1.getBalance()}`,
    );
  });

  test('should throw error when transferring to the same account', () => {
    expect(() => BankAcc1.transfer(12, BankAcc1)).toThrow(`Transfer failed`);
  });

  test('should deposit money', () => {
    BankAcc1.deposit(123);
    expect(BankAcc1.getBalance()).toBe(246);
  });

  test('should withdraw money', () => {
    BankAcc1.withdraw(123);
    expect(BankAcc1.getBalance()).toBe(0);
  });

  test('should transfer money', () => {
    BankAcc1.transfer(123, BankAcc2);
    expect(BankAcc2.getBalance()).toBe(444);
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
    jest.spyOn(BankAcc1, 'fetchBalance').mockReturnValue(Promise.resolve(42));
    await BankAcc1.synchronizeBalance();
    expect(BankAcc1.getBalance()).toBe(42);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest.spyOn(_, 'random').mockReturnValue(0);
    expect(BankAcc1.synchronizeBalance()).rejects.toThrow(
      'Synchronization failed',
    );
  });
});
