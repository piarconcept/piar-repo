export interface BaseEntityProps {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class BaseEntity implements BaseEntityProps {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: BaseEntityProps) {
    this.id = props.id;
    if (!props.createdAt) {
      this.createdAt = new Date();
    } else {
      this.createdAt = new Date(props.createdAt);
    }
    if (!props.updatedAt) {
      this.updatedAt = new Date();
    } else {
      this.updatedAt = new Date(props.updatedAt);
    }
  }
}