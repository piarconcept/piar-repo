# Domain Fields Package

**Status**: ✅ Active  
**Package**: `@piar/domain-fields`  
**Location**: `packages/domain/fields/`  
**Created**: 2026-01-15  
**Last Updated**: 2026-01-15

## Overview

The `@piar/domain-fields` package provides a comprehensive field configuration and metadata system for entities. This package serves as a single source of truth for both backend and frontend applications, defining how fields should be validated, rendered, and behave in different contexts.

## Purpose

This package enables:

- **Unified Field Configuration**: Single definition used by both backend and frontend
- **Type Safety**: Full TypeScript support with strict typing
- **Validation Rules**: Built-in and custom validation logic
- **UI Metadata**: Specifications for how fields should be rendered
- **Field Dependencies**: Define relationships between fields
- **Conditional Logic**: Show/hide fields based on other field values
- **Permission Control**: Define who can view and edit fields
- **Transform Functions**: Convert values between storage and display formats

## Architecture

### Core Types

#### FieldType Enum
Defines all supported field types:

```typescript
export enum FieldType {
  // Basic types
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Date = 'date',
  
  // Specialized types
  Email = 'email',
  Phone = 'phone',
  URL = 'url',
  
  // Complex types
  Text = 'text',
  Select = 'select',
  MultiSelect = 'multi-select',
  Radio = 'radio',
  Checkbox = 'checkbox',
  
  // Special types
  File = 'file',
  Image = 'image',
  Color = 'color',
  JSON = 'json',
}
```

#### FieldConfig Interface
Main configuration interface for individual fields:

```typescript
interface FieldConfig<T = unknown> {
  // Basic properties
  key: string;
  type: FieldType;
  label: string;
  description?: string;
  
  // Behavior
  required?: boolean;
  editable?: boolean;
  visible?: boolean;
  disabled?: boolean;
  
  // Default values
  defaultValue?: T;
  
  // Validation
  validation?: ValidationRule | ValidationRule[];
  
  // UI Configuration
  ui?: UIConfig;
  
  // Dependencies
  dependsOn?: string[] | FieldDependency[];
  
  // Visibility rules
  visibleWhen?: VisibilityRule | VisibilityRule[];
  
  // Options (for select/radio/checkbox)
  options?: FieldOption[] | ((context: Record<string, unknown>) => FieldOption[] | Promise<FieldOption[]>);
  
  // Permissions
  permissions?: {
    view?: string[];
    edit?: string[];
  };
  
  // Metadata
  metadata?: Record<string, unknown>;
  
  // Transform functions
  transform?: {
    input?: (value: T) => unknown;
    output?: (value: unknown) => T;
  };
}
```

#### EntityFieldsConfig Interface
Configuration for all fields in an entity:

```typescript
interface EntityFieldsConfig {
  entityName: string;
  fields: FieldConfig[];
  groups?: FieldGroup[];
}
```

## Usage Examples

### Importing Entity Configurations

```typescript
import { 
  baseEntityFieldsConfig,
  accountEntityFieldsConfig,
  accountSpecificFields 
} from '@piar/domain-fields';

// Use base entity fields
console.log(baseEntityFieldsConfig.fields); // [id, createdAt, updatedAt]

// Use account entity fields (includes base fields)
console.log(accountEntityFieldsConfig.fields); // All 7 fields

// Use only account-specific fields
console.log(accountSpecificFields); // [accountCode, email, passwordHash, role]
```

### Basic Field Configuration

```typescript
import { FieldConfig, FieldType } from '@piar/domain-fields';

const emailField: FieldConfig = {
  key: 'email',
  type: FieldType.Email,
  label: 'Email Address',
  required: true,
  editable: true,
  validation: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Invalid email format'
  }
};
```

### Field with UI Configuration

```typescript
const bioField: FieldConfig = {
  key: 'bio',
  type: FieldType.Text,
  label: 'Biography',
  description: 'Tell us about yourself',
  editable: true,
  ui: {
    component: 'textarea',
    rows: 5,
    placeholder: 'Enter your biography...',
    helpText: 'Maximum 500 characters'
  },
  validation: {
    maxLength: 500,
    message: 'Bio must be 500 characters or less'
  }
};
```

### Field with Dependencies

```typescript
const stateField: FieldConfig = {
  key: 'state',
  type: FieldType.Select,
  label: 'State',
  required: true,
  editable: true,
  dependsOn: ['country'],
  visibleWhen: {
    field: 'country',
    operator: 'equals',
    value: 'US'
  },
  options: (context) => {
    // Dynamic options based on selected country
    return getStatesByCountry(context.country);
  }
};
```

### Complete Entity Configuration

```typescript
import { EntityFieldsConfig, FieldType } from '@piar/domain-fields';

const userProfileConfig: EntityFieldsConfig = {
  entityName: 'UserProfile',
  fields: [
    {
      key: 'avatar',
      type: FieldType.Image,
      label: 'Profile Picture',
      editable: true,
      ui: {
        accept: 'image/*',
        helpText: 'Recommended size: 400x400px'
      }
    },
    {
      key: 'firstName',
      type: FieldType.String,
      label: 'First Name',
      required: true,
      editable: true,
      validation: {
        minLength: 2,
        message: 'First name must be at least 2 characters'
      }
    },
    {
      key: 'lastName',
      type: FieldType.String,
      label: 'Last Name',
      required: true,
      editable: true,
      validation: {
        minLength: 2,
        message: 'Last name must be at least 2 characters'
      }
    },
    {
      key: 'email',
      type: FieldType.Email,
      label: 'Email',
      required: true,
      editable: false, // Cannot change email
      validation: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Invalid email format'
      }
    },
    {
      key: 'country',
      type: FieldType.Select,
      label: 'Country',
      required: true,
      editable: true,
      options: [
        { value: 'US', label: 'United States' },
        { value: 'UK', label: 'United Kingdom' },
        { value: 'ES', label: 'Spain' }
      ]
    },
    {
      key: 'state',
      type: FieldType.Select,
      label: 'State',
      editable: true,
      dependsOn: ['country'],
      visibleWhen: {
        field: 'country',
        operator: 'equals',
        value: 'US'
      }
    }
  ],
  groups: [
    {
      id: 'basic',
      label: 'Basic Information',
      fields: ['avatar', 'firstName', 'lastName', 'email']
    },
    {
      id: 'location',
      label: 'Location',
      fields: ['country', 'state']
    }
  ]
};
```

### Field with Permissions

```typescript
const salaryField: FieldConfig = {
  key: 'salary',
  type: FieldType.Number,
  label: 'Salary',
  editable: true,
  permissions: {
    view: ['admin', 'hr', 'finance'],
    edit: ['admin', 'hr']
  },
  ui: {
    prefix: '$',
    format: 'currency'
  },
  transform: {
    input: (value) => value * 100, // Store in cents
    output: (value) => value / 100  // Display in dollars
  }
};
```

## Package Structure

```
packages/domain/fields/
├── src/
│   ├── common/
│   │   └── types.ts              # All type definitions
│   ├── entities/
│   │   ├── base-entity.config.ts # BaseEntity field configuration
│   │   └── account-entity.config.ts # AccountEntity field configuration
│   └── index.ts                  # Main exports
├── tests/
│   ├── types.test.ts             # Type definition tests
│   └── entities.test.ts          # Entity configuration tests
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── eslint.config.mjs
└── README.md
```

## Testing

The package has 100% test coverage with 65 tests covering:

- All field types (13 types)
- Basic field configuration
- Validation rules (single and multiple)
- UI configuration
- Field dependencies (string array and FieldDependency)
- Visibility rules
- Permissions
- Transform functions
- Entity configurations (BaseEntity and AccountEntity)
- Field groups
- Complex scenarios
- Entity-specific field tests (41 tests)
  - Base entity fields (id, createdAt, updatedAt)
  - Account entity fields (accountCode, email, passwordHash, role)
  - Field validation rules
  - Permission checks
  - UI configuration
  - Field groups and organization
  - Integration scenarios

Run tests:

```bash
# Run tests
pnpm --filter @piar/domain-fields test

# Run with coverage
pnpm --filter @piar/domain-fields test:coverage
```

## Integration

### Backend Usage

The backend can use field configurations to:

1. **Validate Input**: Check if values match field validation rules
2. **Authorization**: Verify user permissions before allowing field edits
3. **Data Transformation**: Apply transform functions before saving to database
4. **API Responses**: Include field metadata in responses for dynamic forms

```typescript
// Example: Using AccountEntity field config for validation
import { accountEntityFieldsConfig } from '@piar/domain-fields';

function validateAccountField(fieldKey: string, value: unknown, userRole: string): boolean {
  const fieldConfig = accountEntityFieldsConfig.fields.find(f => f.key === fieldKey);
  
  if (!fieldConfig) {
    return false;
  }
  
  // Check if user has permission to edit
  if (!fieldConfig.permissions?.edit?.includes(userRole)) {
    throw new Error('Permission denied');
  }
  
  // Check required
  if (fieldConfig.required && !value) {
    return false;
  }
  
  // Validate accountCode pattern
  if (fieldKey === 'accountCode' && typeof value === 'string') {
    const validation = fieldConfig.validation as any[];
    const patternRule = validation.find(v => v.pattern);
    return patternRule.pattern.test(value);
  }
  
  return true;
}

// Example usage
validateAccountField('accountCode', 'ACC_001', 'admin'); // true
validateAccountField('role', 'admin', 'user'); // throws: Permission denied
```

### Frontend Usage

The frontend can use field configurations to:

1. **Dynamic Forms**: Generate forms automatically from field configs
2. **Validation**: Client-side validation before API calls
3. **Conditional Logic**: Show/hide fields based on dependencies
4. **UI Rendering**: Use UI metadata to render appropriate components

```typescript
// Example: Dynamic form component for AccountEntity (React)
import { accountEntityFieldsConfig, FieldType } from '@piar/domain-fields';

function AccountForm({ userRole }: { userRole: string }) {
  // Get fields user can edit
  const editableFields = accountEntityFieldsConfig.fields.filter(
    field => field.editable && field.permissions?.edit?.includes(userRole)
  );
  
  // Get fields grouped by "basic" group
  const basicGroup = accountEntityFieldsConfig.groups?.find(g => g.id === 'basic');
  const basicFields = editableFields.filter(f => basicGroup?.fields.includes(f.key));
  
  return (
    <form>
      {basicFields.map(field => {
        switch (field.type) {
          case FieldType.String:
            return (
              <input
                key={field.key}
                name={field.key}
                placeholder={field.ui?.placeholder}
                required={field.required}
                pattern={field.validation?.[0]?.pattern?.source}
              />
            );
            
          case FieldType.Email:
            return (
              <input
                key={field.key}
                type="email"
                name={field.key}
                placeholder={field.ui?.placeholder}
                required={field.required}
              />
            );
            
          case FieldType.Select:
            return (
              <select key={field.key} name={field.key} required={field.required}>
                {Array.isArray(field.options) && field.options.map(opt => (
                  <option key={String(opt.value)} value={String(opt.value)}>
                    {opt.label}
                  </option>
                ))}
              </select>
            );
        }
      })}
    </form>
  );
}
```

## Future Enhancements

Potential additions to consider:

1. **Helper Functions**: Utilities for validation, transformation, etc.
2. **Preset Configurations**: Common field configurations (email, phone, etc.)
3. **Schema Generation**: Generate JSON Schema from field configs
4. **React Hooks**: Custom hooks for form handling
5. **Validation Library**: Complete validation engine
6. **Field Templates**: Reusable field configuration templates

## Best Practices

1. **Centralized Definitions**: Define field configs once, use everywhere
2. **Type Safety**: Always use TypeScript types for type checking
3. **Validation**: Define validation rules in field configs, not in components
4. **Permissions**: Always check permissions before showing/editing fields
5. **Dependencies**: Keep field dependencies simple and avoid circular references
6. **Testing**: Test field configurations with various scenarios
7. **Documentation**: Document custom field types and validation rules

## Dependencies

- TypeScript 5.9.3
- Vitest 2.1.8 (dev)
- @vitest/coverage-v8 (dev)

## License

MIT - Copyright (c) 2026 Piar Concept

## Related Documentation

- [creating-packages.md](creating-packages.md) - Guide for creating packages
- [testing-guide.md](testing-guide.md) - Testing standards
- [domain-models.md](domain-models.md) - Domain models package
