import { describe, it, expect } from 'vitest';
import { AccountEntity, AccountEntityProps } from '../src';

describe('AccountEntity', () => {
  it('should create account entity with required properties', () => {
    const props: AccountEntityProps = {
      id: 'acc-001',
      accountCode: 'ACC-001'
    };

    const account = new AccountEntity(props);

    expect(account.id).toBe('acc-001');
    expect(account.accountCode).toBe('ACC-001');
    expect(account.role).toBeUndefined();
    expect(account.createdAt).toBeInstanceOf(Date);
    expect(account.updatedAt).toBeInstanceOf(Date);
  });

  it('should create account entity with role', () => {
    const props: AccountEntityProps = {
      id: 'acc-002',
      accountCode: 'ACC-002',
      role: 'admin'
    };

    const account = new AccountEntity(props);

    expect(account.id).toBe('acc-002');
    expect(account.accountCode).toBe('ACC-002');
    expect(account.role).toBe('admin');
  });

  it('should extend BaseEntity with all base properties', () => {
    const createdDate = new Date('2025-01-01');
    const updatedDate = new Date('2025-01-15');

    const props: AccountEntityProps = {
      id: 'acc-003',
      accountCode: 'ACC-003',
      role: 'user',
      createdAt: createdDate,
      updatedAt: updatedDate
    };

    const account = new AccountEntity(props);

    expect(account.id).toBe('acc-003');
    expect(account.accountCode).toBe('ACC-003');
    expect(account.role).toBe('user');
    expect(account.createdAt).toEqual(createdDate);
    expect(account.updatedAt).toEqual(updatedDate);
  });
});
