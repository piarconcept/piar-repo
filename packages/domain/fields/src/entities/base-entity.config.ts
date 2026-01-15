import { BaseEntityProps } from '@piar/domain-models';
import { EntityFieldsConfig, FieldType } from '../common/types';

/**
 * Base entity fields configuration
 * These fields are common to all entities
 */
export const baseEntityFieldsConfig: EntityFieldsConfig<BaseEntityProps> = {
  entityName: 'BaseEntity',
  fields: [
    {
      key: 'id',
      type: FieldType.String,
      label: 'ID',
      description: 'Unique identifier',
      required: true,
      editable: false,
      visible: true,
      ui: {
        component: 'input',
        helpText: 'Auto-generated unique identifier',
        className: 'font-mono text-sm',
      },
      permissions: {
        view: ['admin', 'user'],
        edit: [],
      },
    },
    {
      key: 'createdAt',
      type: FieldType.Date,
      label: 'Created At',
      description: 'Date and time when the entity was created',
      required: true,
      editable: false,
      visible: true,
      ui: {
        component: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        helpText: 'Automatically set on creation',
      },
      permissions: {
        view: ['admin', 'user'],
        edit: [],
      },
    },
    {
      key: 'updatedAt',
      type: FieldType.Date,
      label: 'Updated At',
      description: 'Date and time when the entity was last updated',
      required: true,
      editable: false,
      visible: true,
      ui: {
        component: 'datetime',
        format: 'YYYY-MM-DD HH:mm:ss',
        helpText: 'Automatically updated on changes',
      },
      permissions: {
        view: ['admin', 'user'],
        edit: [],
      },
    },
  ],
  groups: [
    {
      id: 'metadata',
      label: 'Metadata',
      description: 'System-generated metadata fields',
      fields: ['id', 'createdAt', 'updatedAt'],
      collapsible: true,
      defaultCollapsed: true,
      order: 999,
    },
  ],
};
