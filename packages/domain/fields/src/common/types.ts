/**
 * Field types supported by the system
 */
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
  Text = 'text', // Long text / textarea
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

/**
 * Validation rule for a field
 */
export interface ValidationRule {
  pattern?: RegExp;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  message: string;
  custom?: (value: unknown, context: Record<string, unknown>) => boolean;
}

/**
 * UI rendering configuration for a field
 */
export interface UIConfig {
  component?: string;
  placeholder?: string;
  helpText?: string;
  className?: string;
  rows?: number; // For textarea
  cols?: number; // For textarea
  accept?: string; // For file/image inputs
  multiple?: boolean; // For file/select inputs
  format?: string; // For date/number formatting
  icon?: string;
  prefix?: string;
  suffix?: string;
}

/**
 * Field visibility conditions
 */
export interface VisibilityRule {
  field: string;
  operator: 'equals' | 'not-equals' | 'contains' | 'greater-than' | 'less-than' | 'exists' | 'not-exists';
  value?: unknown;
}

/**
 * Field dependency configuration with type-safe field references
 */
export interface FieldDependency<TEntity = unknown> {
  field: TEntity extends Record<string, unknown> ? keyof TEntity : string;
  condition?: (value: unknown) => boolean;
}

/**
 * Select/Radio/Checkbox option
 */
export interface FieldOption {
  value: string | number | boolean;
  label: string;
  disabled?: boolean;
  description?: string;
  icon?: string;
}

/**
 * Main field configuration interface with type-safe keys
 */
export interface FieldConfig<TEntity = unknown, TValue = unknown> {
  // Basic properties
  key: TEntity extends Record<string, unknown> ? keyof TEntity : string;
  type: FieldType;
  label: string;
  description?: string;
  
  // Behavior
  required?: boolean;
  editable?: boolean;
  visible?: boolean;
  disabled?: boolean;
  
  // Default and initial values
  defaultValue?: TValue;
  
  // Validation
  validation?: ValidationRule | ValidationRule[];
  
  // UI Configuration
  ui?: UIConfig;
  
  // Dependencies
  dependsOn?: TEntity extends Record<string, unknown> ? (keyof TEntity)[] | FieldDependency<TEntity>[] : string[] | FieldDependency[];
  
  // Visibility rules
  visibleWhen?: VisibilityRule | VisibilityRule[];
  
  // Options (for select, radio, checkbox)
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
    input?: (value: TValue) => unknown; // Transform before saving
    output?: (value: unknown) => TValue; // Transform when loading
  };
}

/**
 * Entity field configuration with type-safe keys
 */
export interface EntityFieldsConfig<TEntity = unknown> {
  entityName: string;
  fields: FieldConfig<TEntity, unknown>[];
  groups?: FieldGroup<TEntity>[];
}

/**
 * Field group for organizing fields in the UI with type-safe field references
 */
export interface FieldGroup<TEntity = unknown> {
  id: string;
  label: string;
  description?: string;
  fields: TEntity extends Record<string, unknown> ? (keyof TEntity)[] : string[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  order?: number;
}

/**
 * Context provided to dynamic field configurations
 */
export interface FieldContext {
  values: Record<string, unknown>;
  entity?: Record<string, unknown>;
  user?: {
    id: string;
    roles: string[];
    permissions: string[];
  };
  mode?: 'create' | 'edit' | 'view';
}

/**
 * Field validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}
