import { describe, it, expect } from 'vitest';
import { BaseEntity, BaseEntityProps } from '../src/entities/base/base.entity';

describe('BaseEntity', () => {
  it('should create entity with provided id and auto-generate timestamps', () => {
    const props: BaseEntityProps = {
      id: '123'
    };

    const entity = new BaseEntity(props);

    expect(entity.id).toBe('123');
    expect(entity.createdAt).toBeInstanceOf(Date);
    expect(entity.updatedAt).toBeInstanceOf(Date);
  });

  it('should create entity with provided timestamps', () => {
    const createdDate = new Date('2025-01-01');
    const updatedDate = new Date('2025-01-15');

    const props: BaseEntityProps = {
      id: '456',
      createdAt: createdDate,
      updatedAt: updatedDate
    };

    const entity = new BaseEntity(props);

    expect(entity.id).toBe('456');
    expect(entity.createdAt).toEqual(createdDate);
    expect(entity.updatedAt).toEqual(updatedDate);
  });

  it('should create new Date instances from provided timestamps', () => {
    const props: BaseEntityProps = {
      id: '789',
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-15')
    };

    const entity = new BaseEntity(props);

    // Ensure they are new Date instances, not the same reference
    expect(entity.createdAt).not.toBe(props.createdAt);
    expect(entity.updatedAt).not.toBe(props.updatedAt);
  });
});
