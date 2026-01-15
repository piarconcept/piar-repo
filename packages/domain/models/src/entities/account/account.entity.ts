import {
  BaseEntityProps, BaseEntity
} from '../base/base.entity.js';

export interface AccountEntityProps extends BaseEntityProps {
  accountCode: string;
  email?: string;
  passwordHash?: string;
  role?: 'admin' | 'user';
}

export class AccountEntity extends BaseEntity implements AccountEntityProps {
  accountCode: string;
  role?: 'admin' | 'user';
  email?: string | undefined;
  passwordHash?: string | undefined;

  constructor(props: AccountEntityProps) {
    super(props);
    this.accountCode = props.accountCode;
    this.role = props.role;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
  }
}