import { describe, expect, it } from 'vitest';
import { FieldType } from '../src';
import { 
  accountEntityFieldsConfig, 
  accountSpecificFields 
} from '../src/entities/account-entity.config';

type ValidationRule = { minLength?: number; maxLength?: number; pattern?: RegExp; message: string };

describe('Account Entity Fields Configuration', () => {
  it('should export account entity fields config', () => {
    expect(accountEntityFieldsConfig).toBeDefined();
    expect(accountEntityFieldsConfig.entityName).toBe('AccountEntity');
  });

  it('should have 7 total fields (3 base + 4 account)', () => {
    expect(accountEntityFieldsConfig.fields).toHaveLength(7);
  });

  describe('accountCode field', () => {
    const field = accountEntityFieldsConfig.fields.find(f => f.key === 'accountCode');

    it('should be configured correctly', () => {
      expect(field).toBeDefined();
      expect(field?.type).toBe(FieldType.String);
    });

    it('should validate pattern', () => {
      const validations = field?.validation as Array<ValidationRule>;
      const patternRule = validations?.find(v => v.pattern);
      
      if (patternRule?.pattern) {
        expect(patternRule.pattern.test('ACC_001')).toBe(true);
      }
    });
  });

  describe('Account Specific Fields Helper', () => {
    it('should have 4 account-specific fields', () => {
      expect(accountSpecificFields).toHaveLength(4);
    });
  });
});
