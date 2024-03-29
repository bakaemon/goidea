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
        type: mongoose.Schema.Types.Date,
    })
    finalClosureDate: Date;
    
    @Prop({
        required: true,
        ref: "Department",
        type: mongoose.Schema.Types.ObjectId
    })
    department: string;
    

    
    @Prop({
        required: true,
        ref: "Account",
        type: mongoose.Schema.Types.ObjectId
    })
    author: string;
    
}

export const EventSchema = SchemaFactory.createForClass(Event);
EventSchema.plugin(paginate);
