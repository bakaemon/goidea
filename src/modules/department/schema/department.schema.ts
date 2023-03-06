import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as paginate from "mongoose-paginate-v2";

export type DepartmentDocument = Department & Document;

@Schema({ timestamps: true })
export class Department {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
DepartmentSchema.plugin(paginate);