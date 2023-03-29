import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import * as paginate from "mongoose-paginate-v2";

export type TagDocument = Tag & Document;

@Schema({ timestamps: true })
export class Tag {
    @Prop({ required: true })
    name: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);

TagSchema.plugin(paginate);