import { BaseEntityProps } from '@piar/domain-models';
import { describe, expect, it } from 'vitest';
import { FieldType } from '../src';
import { baseEntityFieldsConfig } from '../src/entities/base-entity.config';

describe('Base Entity Fields Configuration', () => {
  it('should export base entity fields config', () => {
    expect(baseEntityFieldsConfig).toBeDefined();
    expect(baseEntityFieldsConfig.entityName).toBe('BaseEntity');
  });

  it('should have exactly 3 base entity fields', () => {
    expect(baseEntityFieldsConfig.fields).toHaveLength(3);
  });

  it('should have all required base entity field keys', () => {
    const fieldKeys = baseEntityFieldsConfig.fields.map(f => f.key);
    expect(fieldKeys).toContain('id');
    expect(fieldKeys).toContain('createdAt');
    expect(fieldKeys).toContain('updatedAt');
  });

  it('should only allow valid BaseEntityProps keys', () => {
    // This test validates that TypeScript enforces the correct keys
    const validKeys: (keyof BaseEntityProps)[] = ['id', 'createdAt', 'updatedAt'];
    const fieldKeys = baseEntityFieldsConfig.fields.map(f => f.key);
    
    fieldKeys.forEach(key => {
      expect(validKeys).toContain(key as keyof BaseEntityProps);
    });
  });

  describe('id field', () => {
    const idField = baseEntityFieldsConfig.fields.find(f => f.key === 'id');

    it('should be configured correctly', () => {
      expect(idField).toBeDefined();
      expect(idField?.type).toBe(FieldType.String);
      expect(idField?.label).toBe('ID');
      expect(idField?.description).toBe('Unique identifier');
    });

    it('should be required and not editable', () => {
      expect(idField?.required).toBe(true);
      expect(idField?.editable).toBe(false);
      expect(idField?.visible).toBe(true);
    });

    it('should have proper UI configuration', () => {
      expect(idField?.ui?.component).toBe('input');
      expect(idField?.ui?.helpText).toBe('Auto-generated unique identifier');
      expect(idField?.ui?.className).toBe('font-mono text-sm');
    });

    it('should have proper permissions', () => {
      expect(idField?.permissions?.view).toEqual(['admin', 'user']);
      expect(idField?.permissions?.edit).toEqual([]);
    });
  });

  describe('createdAt field', () => {
    const createdAtField = baseEntityFieldsConfig.fields.find(f => f.key === 'createdAt');

    it('should be configured correctly', () => {
      expect(createdAtField).toBeDefined();
      expect(createdAtField?.type).toBe(FieldType.Date);
      expect(createdAtField?.label).toBe('Created At');
      expect(createdAtField?.description).toBe('Date and time when the entity was created');
    });

    it('should be required and not editable', () => {
      expect(createdAtField?.required).toBe(true);
      expect(createdAtField?.editable).toBe(false);
      expect(createdAtField?.visible).toBe(true);
    });

    it('should have date formatting', () => {
      expect(createdAtField?.ui?.component).toBe('datetime');
      expect(createdAtField?.ui?.format).toBe('YYYY-MM-DD HH:mm:ss');
      expect(createdAtField?.ui?.helpText).toBe('Automatically set on creation');
    });

    it('should have proper permissions', () => {
      expect(createdAtField?.permissions?.view).toEqual(['admin', 'user']);
      expect(createdAtField?.permissions?.edit).toEqual([]);
    });
  });

  describe('updatedAt field', () => {
    const updatedAtField = baseEntityFieldsConfig.fields.find(f => f.key === 'updatedAt');

    it('should be configured correctly', () => {
      expect(updatedAtField).toBeDefined();
      expect(updatedAtField?.type).toBe(FieldType.Date);
      expect(updatedAtField?.label).toBe('Updated At');
      expect(updatedAtField?.description).toBe('Date and time when the entity was last updated');
    });

    it('should be required and not editable', () => {
      expect(updatedAtField?.required).toBe(true);
      expect(updatedAtField?.editable).toBe(false);
      expect(updatedAtField?.visible).toBe(true);
    });

    it('should have date formatting', () => {
      expect(updatedAtField?.ui?.component).toBe('datetime');
      expect(updatedAtField?.ui?.format).toBe('YYYY-MM-DD HH:mm:ss');
      expect(updatedAtField?.ui?.helpText).toBe('Automatically updated on changes');
    });

    it('should have proper permissions', () => {
      expect(updatedAtField?.permissions?.view).toEqual(['admin', 'user']);
      expect(updatedAtField?.permissions?.edit).toEqual([]);
    });
  });

  describe('Field Groups', () => {
    it('should have metadata group', () => {
      expect(baseEntityFieldsConfig.groups).toBeDefined();
      expect(baseEntityFieldsConfig.groups).toHaveLength(1);
    });

    it('should configure metadata group correctly', () => {
      const metadataGroup = baseEntityFieldsConfig.groups?.[0];
      
      expect(metadataGroup?.id).toBe('metadata');
      expect(metadataGroup?.label).toBe('Metadata');
      expect(metadataGroup?.description).toBe('System-generated metadata fields');
    });

    it('should include all base fields in metadata group', () => {
      const metadataGroup = baseEntityFieldsConfig.groups?.[0];
      
      expect(metadataGroup?.fields).toEqual(['id', 'createdAt', 'updatedAt']);
    });

    it('should be collapsible and collapsed by default', () => {
      const metadataGroup = baseEntityFieldsConfig.groups?.[0];
      
      expect(metadataGroup?.collapsible).toBe(true);
      expect(metadataGroup?.defaultCollapsed).toBe(true);
    });

    it('should have low priority order', () => {
      const metadataGroup = baseEntityFieldsConfig.groups?.[0];
      
      expect(metadataGroup?.order).toBe(999);
    });
  });

  describe('Permissions', () => {
    it('should allow admin and user to view all fields', () => {
      baseEntityFieldsConfig.fields.forEach(field => {
        expect(field.permissions?.view).toContain('admin');
        expect(field.permissions?.view).toContain('user');
      });
    });

    it('should not allow anyone to edit base fields', () => {
      baseEntityFieldsConfig.fields.forEach(field => {
        expect(field.permissions?.edit).toHaveLength(0);
      });
    });
  });

  describe('Type Safety', () => {
    it('should enforce BaseEntityProps keys at compile time', () => {
      // This test validates TypeScript type checking
      // If we try to add a field with an invalid key, TypeScript will error
      type ValidKeys = typeof baseEntityFieldsConfig.fields[number]['key'];
      
      const testKey: ValidKeys = 'id';
      expect(testKey).toBe('id');
    });

    it('should work with BaseEntityProps type', () => {
      const testEntity: BaseEntityProps = {
        id: 'test-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // All field keys should be valid BaseEntityProps keys
      baseEntityFieldsConfig.fields.forEach(field => {
        expect(field.key in testEntity).toBe(true);
      });
    });
  });
});
