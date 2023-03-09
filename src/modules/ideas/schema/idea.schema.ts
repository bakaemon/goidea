import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { VotesSchema, VotesDocument } from './votes.schema';
import * as paginate from "mongoose-paginate-v2";
import { ConflictException } from "@nestjs/common";

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
        ref: "Tag"
    })
    tags: string[];

    // closure date
    @Prop({
        type: mongoose.Schema.Types.Date,
    })
    closureDate: Date;

    @Prop({
        type: [mongoose.Schema.Types.String],
    })
    flag: string[];
}

export const IdeaSchema = SchemaFactory.createForClass(Idea);


IdeaSchema.pre('save', function (next) {
    this.flag = [Flag.Queue];
    next();
});

IdeaSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new ConflictException('Idea already exists'));
    } 
    next();
});
IdeaSchema.post('findOneAndUpdate', function (error, doc, next) {
    if (doc.flag.includes(Flag.Open) && doc.closureDate === null) {
        // set closure date is 2 weeks from now
        doc.closureDate = new Date(Date.now() + 12096e5);
    }
    next();
});

IdeaSchema.plugin(paginate);
    