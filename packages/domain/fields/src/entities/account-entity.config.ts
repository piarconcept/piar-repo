import { AccountEntityProps } from '@piar/domain-models';
import { baseEntityFieldsConfig } from './base-entity.config';
import { EntityFieldsConfig, FieldType } from '../common/types';

/**
 * Account entity fields configuration
 * Extends base entity with account-specific fields
 */
export const accountEntityFieldsConfig: EntityFieldsConfig<AccountEntityProps> = {
  entityName: 'AccountEntity',
  fields: [
    // Inherit base entity fields
    ...baseEntityFieldsConfig.fields,
    
    // Account-specific fields
    {
      key: 'accountCode',
      type: FieldType.String,
      label: 'Account Code',
      description: 'Unique account identifier code',
      required: true,
      editable: true,
      visible: true,
      validation: [
        {
          minLength: 3,
          message: 'Account code must be at least 3 characters',
        },
        {
          maxLength: 50,
          message: 'Account code must be 50 characters or less',
        },
        {
          pattern: /^[A-Z0-9_-]+$/,
          message: 'Account code must contain only uppercase letters, numbers, hyphens, and underscores',
        },
      ],
      ui: {
        component: 'input',
        placeholder: 'ACC_001',
        helpText: 'Unique code for this account (uppercase letters, numbers, -, _)',
        className: 'font-mono',
      },
      permissions: {
        view: ['admin', 'user'],
        edit: ['admin'],
      },
    },
    {
      key: 'email',
      type: FieldType.Email,
      label: 'Email',
      description: 'Account email address',
      required: false,
      editable: true,
      visible: true,
      validation: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Invalid email format',
      },
      ui: {
        component: 'input',
        placeholder: 'user@example.com',
        helpText: 'Email address for this account',
        icon: 'mail',
      },
      permissions: {
        view: ['admin', 'user'],
        edit: ['admin', 'user'],
      },
    },
    {
      key: 'passwordHash',
      type: FieldType.String,
      label: 'Password Hash',
      description: 'Hashed password (internal)',
      required: false,
      editable: false,
      visible: false,
      ui: {
        component: 'hidden',
      },
      permissions: {
        view: [],
        edit: [],
      },
      metadata: {
        internal: true,
        sensitive: true,
      },
    },
    {
      key: 'role',
      type: FieldType.Select,
      label: 'Role',
      description: 'User role for permissions',
      required: false,
      editable: true,
      visible: true,
      defaultValue: 'user',
      options: [
        {
          value: 'admin',
          label: 'Administrator',
          description: 'Full system access',
          icon: 'shield',
        },
        {
          value: 'user',
          label: 'User',
          description: 'Standard user access',
          icon: 'user',
        },
      ],
      ui: {
        component: 'select',
        helpText: 'Assign role for this account',
      },
      permissions: {
        view: ['admin', 'user'],
        edit: ['admin'],
      },
    },
  ],
  groups: [
    {
      id: 'basic',
      label: 'Basic Information',
      description: 'Core account information',
      fields: ['accountCode', 'email', 'role'],
      collapsible: false,
      order: 1,
    },
    {
      id: 'security',
      label: 'Security',
      description: 'Security and authentication settings',
      fields: ['passwordHash'],
      collapsible: true,
      defaultCollapsed: true,
      order: 2,
    },
    // Include metadata group from base
    ...(baseEntityFieldsConfig.groups || []),
  ],
};

/**
 * Helper to get only account-specific fields (excluding base entity fields)
 */
export const accountSpecificFields = accountEntityFieldsConfig.fields.filter(
  (field) => !['id', 'createdAt', 'updatedAt'].includes(field.key as string)
);
