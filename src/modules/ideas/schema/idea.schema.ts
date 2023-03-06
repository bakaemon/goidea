import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { VotesSchema, VotesDocument } from './votes.schema';
import * as paginate from "mongoose-paginate-v2";

export type IdeaDocument = Idea & Document;

@Schema({ timestamps: true })
export class Idea {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    })
    category: string;

    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account"
    })
    author: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account"
    })
    assignee: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account"
    })
    approver: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account"
    })
    reviewer: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag"
    })
    tags: string[];

    // closure date
    @Prop({
        type: mongoose.Schema.Types.Date,
    })
    closureDate: Date;

}

export const IdeaSchema = SchemaFactory.createForClass(Idea);


IdeaSchema.pre('save', function (next) {
});

IdeaSchema.plugin(paginate);
    