import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmployeeDocument = Employee & Document;

@Schema()
export class Employee {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  department: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  location: string;

  @Prop()
  avatar: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
