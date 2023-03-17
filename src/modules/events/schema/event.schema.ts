import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import * as paginate from "mongoose-paginate-v2";
import { ObjectId } from 'mongoose';

export type EventDocument = Event & Document;

@Schema({ timestamps: true })
export class Event {
    @Prop({ required: true })
    name: string;
    
    @Prop({ required: true })
    description: string;
    
    @Prop({
        required: true,
        type: mongoose.Schema.Types.Date,
    })
    closureDate: Date;
    
    @Prop({
        required: true,
        ref: "Department",
        type: mongoose.Schema.Types.ObjectId
    })
    department: string;
    
    @Prop({
        required: true,
        ref: "Category",
        type: mongoose.Schema.Types.ObjectId
    })
    category: string;
    
    @Prop({
        required: true,
        ref: "User",
        type: mongoose.Schema.Types.ObjectId
    })
    author: string;
    
}

export const EventSchema = SchemaFactory.createForClass(Event);
EventSchema.plugin(paginate);
