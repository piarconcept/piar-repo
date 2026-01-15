import { describe, expect, it } from 'vitest';
import {
  EntityFieldsConfig,
  FieldConfig,
  FieldContext,
  FieldDependency,
  FieldGroup,
  FieldOption,
  FieldType,
  UIConfig,
  ValidationResult,
  ValidationRule,
  VisibilityRule,
} from '../src';

describe('Field Types Export', () => {
  it('should export FieldType enum', () => {
    expect(FieldType.String).toBe('string');
    expect(FieldType.Email).toBe('email');
    expect(FieldType.Select).toBe('select');
  });

  it('should have all basic field types', () => {
    expect(FieldType.String).toBeDefined();
    expect(FieldType.Number).toBeDefined();
    expect(FieldType.Boolean).toBeDefined();
    expect(FieldType.Date).toBeDefined();
  });

  it('should have specialized field types', () => {
    expect(FieldType.Email).toBeDefined();
    expect(FieldType.Phone).toBeDefined();
    expect(FieldType.URL).toBeDefined();
  });

  it('should have complex field types', () => {
    expect(FieldType.Text).toBeDefined();
    expect(FieldType.Select).toBeDefined();
    expect(FieldType.MultiSelect).toBeDefined();
    expect(FieldType.Radio).toBeDefined();
    expect(FieldType.Checkbox).toBeDefined();
  });

  it('should have special field types', () => {
    expect(FieldType.File).toBeDefined();
    expect(FieldType.Image).toBeDefined();
    expect(FieldType.Color).toBeDefined();
    expect(FieldType.JSON).toBeDefined();
  });
});

describe('FieldConfig Interface', () => {
  it('should create a basic field configuration', () => {
    const config: FieldConfig = {
      key: 'email',
      type: FieldType.Email,
      label: 'Email Address',
      required: true,
      editable: true,
    };

    expect(config.key).toBe('email');
    expect(config.type).toBe(FieldType.Email);
    expect(config.label).toBe('Email Address');
    expect(config.required).toBe(true);
    expect(config.editable).toBe(true);
  });

  it('should support validation rules', () => {
    const validation: ValidationRule = {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Invalid email format',
    };

    const config: FieldConfig = {
      key: 'email',
      type: FieldType.Email,
      label: 'Email',
      validation,
    };

    expect(config.validation).toBe(validation);
  });

  it('should support multiple validation rules', () => {
    const validations: ValidationRule[] = [
      { minLength: 8, message: 'Minimum 8 characters' },
      { maxLength: 20, message: 'Maximum 20 characters' },
    ];

    const config: FieldConfig = {
      key: 'password',
      type: FieldType.String,
      label: 'Password',
      validation: validations,
    };

    expect(Array.isArray(config.validation)).toBe(true);
    expect(config.validation).toHaveLength(2);
  });

  it('should support UI configuration', () => {
    const ui: UIConfig = {
      component: 'textarea',
      rows: 5,
      placeholder: 'Enter description...',
      helpText: 'Maximum 500 characters',
    };

    const config: FieldConfig = {
      key: 'description',
      type: FieldType.Text,
      label: 'Description',
      ui,
    };

    expect(config.ui?.component).toBe('textarea');
    expect(config.ui?.rows).toBe(5);
    expect(config.ui?.placeholder).toBe('Enter description...');
  });

  it('should support field dependencies as string array', () => {
    const config: FieldConfig = {
      key: 'state',
      type: FieldType.Select,
      label: 'State',
      dependsOn: ['country'],
    };

    expect(config.dependsOn).toEqual(['country']);
  });

  it('should support field dependencies as FieldDependency array', () => {
    const dependencies: FieldDependency[] = [
      {
        field: 'country',
        condition: (value) => value === 'USA',
      },
    ];

    const config: FieldConfig = {
      key: 'state',
      type: FieldType.Select,
      label: 'State',
      dependsOn: dependencies,
    };

    expect(Array.isArray(config.dependsOn)).toBe(true);
  });

  it('should support static options', () => {
    const options: FieldOption[] = [
      { value: 'draft', label: 'Draft' },
      { value: 'published', label: 'Published' },
    ];

    const config: FieldConfig = {
      key: 'status',
      type: FieldType.Select,
      label: 'Status',
      options,
    };

    expect(config.options).toBe(options);
  });

  it('should support dynamic options as function', () => {
    const config: FieldConfig = {
      key: 'category',
      type: FieldType.Select,
      label: 'Category',
      options: (context) => {
        return [
          { value: String(context.type), label: String(context.type) },
        ];
      },
    };

    expect(typeof config.options).toBe('function');
  });

  it('should support visibility rules', () => {
    const visibilityRule: VisibilityRule = {
      field: 'country',
      operator: 'equals',
      value: 'USA',
    };

    const config: FieldConfig = {
      key: 'ssn',
      type: FieldType.String,
      label: 'SSN',
      visibleWhen: visibilityRule,
    };

    expect(config.visibleWhen).toBe(visibilityRule);
  });

  it('should support permissions', () => {
    const config: FieldConfig = {
      key: 'salary',
      type: FieldType.Number,
      label: 'Salary',
      permissions: {
        view: ['admin', 'hr'],
        edit: ['admin'],
      },
    };

    expect(config.permissions?.view).toEqual(['admin', 'hr']);
    expect(config.permissions?.edit).toEqual(['admin']);
  });

  it('should support metadata', () => {
    const config: FieldConfig = {
      key: 'custom',
      type: FieldType.String,
      label: 'Custom Field',
      metadata: {
        customProp: 'value',
        anotherProp: 123,
      },
    };

    expect(config.metadata?.customProp).toBe('value');
    expect(config.metadata?.anotherProp).toBe(123);
  });
});

describe('EntityFieldsConfig Interface', () => {
  it('should create entity fields configuration', () => {
    const config: EntityFieldsConfig = {
      entityName: 'User',
      fields: [
        {
          key: 'name',
          type: FieldType.String,
          label: 'Name',
          required: true,
        },
        {
          key: 'email',
          type: FieldType.Email,
          label: 'Email',
          required: true,
        },
      ],
    };

    expect(config.entityName).toBe('User');
    expect(config.fields).toHaveLength(2);
    expect(config.fields[0].key).toBe('name');
    expect(config.fields[1].key).toBe('email');
  });

  it('should support field groups', () => {
    const groups: FieldGroup[] = [
      {
        id: 'basic',
        label: 'Basic Information',
        fields: ['name', 'email'],
        collapsible: false,
      },
      {
        id: 'advanced',
        label: 'Advanced Settings',
        fields: ['metadata', 'settings'],
        collapsible: true,
        defaultCollapsed: true,
      },
    ];

    const config: EntityFieldsConfig = {
      entityName: 'User',
      fields: [],
      groups,
    };

    expect(config.groups).toHaveLength(2);
    expect(config.groups?.[0].id).toBe('basic');
    expect(config.groups?.[1].collapsible).toBe(true);
  });
});

describe('FieldContext Interface', () => {
  it('should create field context', () => {
    const context: FieldContext = {
      values: {
        name: 'John',
        email: 'john@example.com',
      },
      mode: 'edit',
    };

    expect(context.values.name).toBe('John');
    expect(context.mode).toBe('edit');
  });

  it('should support user information', () => {
    const context: FieldContext = {
      values: {},
      user: {
        id: '123',
        roles: ['admin'],
        permissions: ['user.edit'],
      },
    };

    expect(context.user?.id).toBe('123');
    expect(context.user?.roles).toContain('admin');
  });

  it('should support entity data', () => {
    const context: FieldContext = {
      values: {},
      entity: {
        id: '456',
        type: 'account',
      },
    };

    expect(context.entity?.id).toBe('456');
    expect(context.entity?.type).toBe('account');
  });
});

describe('ValidationResult Interface', () => {
  it('should create valid result', () => {
    const result: ValidationResult = {
      valid: true,
    };

    expect(result.valid).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  it('should create invalid result with errors', () => {
    const result: ValidationResult = {
      valid: false,
      errors: [
        { field: 'email', message: 'Invalid email format' },
        { field: 'password', message: 'Password too short' },
      ],
    };

    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(2);
    expect(result.errors?.[0].field).toBe('email');
  });
});

describe('Complex Field Configurations', () => {
  it('should create a complete user profile field configuration', () => {
    const config: EntityFieldsConfig = {
      entityName: 'UserProfile',
      fields: [
        {
          key: 'avatar',
          type: FieldType.Image,
          label: 'Profile Picture',
          editable: true,
          ui: {
            accept: 'image/*',
            helpText: 'Recommended size: 400x400px',
          },
        },
        {
          key: 'bio',
          type: FieldType.Text,
          label: 'Biography',
          editable: true,
          ui: {
            component: 'textarea',
            rows: 5,
          },
          validation: {
            maxLength: 500,
            message: 'Bio must be 500 characters or less',
          },
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
            { value: 'ES', label: 'Spain' },
          ],
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
            value: 'US',
          },
        },
      ],
      groups: [
        {
          id: 'profile',
          label: 'Profile Information',
          fields: ['avatar', 'bio'],
        },
        {
          id: 'location',
          label: 'Location',
          fields: ['country', 'state'],
        },
      ],
    };

    expect(config.entityName).toBe('UserProfile');
    expect(config.fields).toHaveLength(4);
    expect(config.groups).toHaveLength(2);
  });
});
