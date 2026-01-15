# @piar/domain-fields

Field configuration and metadata system for entities.

## Purpose

This package provides a comprehensive field configuration system that allows both backend and frontend applications to understand:

- Which fields can be edited
- Which fields are read-only
- Field types and validation rules
- How to render fields in the UI
- Field dependencies and relationships
- Conditional visibility rules
- Custom validation logic

## Installation

```bash
pnpm add @piar/domain-fields
```

## Usage

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

### Field with Dependencies

```typescript
const stateField: FieldConfig = {
  key: 'state',
  type: FieldType.Select,
  label: 'State',
  required: true,
  editable: true,
  dependsOn: ['country'],
  options: (context) => {
    return getStatesByCountry(context.country);
  }
};
```

### UI Rendering Configuration

```typescript
const bioField: FieldConfig = {
  key: 'bio',
  type: FieldType.Text,
  label: 'Biography',
  editable: true,
  ui: {
    component: 'textarea',
    rows: 5,
    placeholder: 'Tell us about yourself...',
    helpText: 'Maximum 500 characters'
  }
};
```

## Features

- **Type Safety**: Full TypeScript support with strict typing
- **Validation**: Built-in and custom validation rules
- **Dependencies**: Define field relationships and conditional logic
- **UI Metadata**: Specify how fields should be rendered
- **Permissions**: Control field visibility and editability
- **Extensible**: Easy to extend with custom field types

## Documentation

For detailed documentation, see [domain-fields.md](../../../docs/features/domain-fields.md).

## License

MIT - Copyright (c) 2026 Piar Concept
