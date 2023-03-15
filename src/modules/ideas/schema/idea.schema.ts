import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { VotesSchema, VotesDocument } from './votes.schema';
import * as paginate from "mongoose-paginate-v2";
import { ConflictException } from "@nestjs/common";
import { Flag, FlagNames } from "@src/common/enums/flag.enum";

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
        ref: "Account"
    })
    author: string;

    @Prop({ 
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    })
    event: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag"
    })
    tags: string[];

    // is anonymous
    @Prop({ default: false })
    anonymous: boolean;

    @Prop({
        type: [mongoose.Schema.Types.String],
        enum: FlagNames,
        default: [Flag.Queue]
    })
    flag: string[];
}

export const IdeaSchema = SchemaFactory.createForClass(Idea);


IdeaSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new ConflictException('Idea already exists'));
    } 
    next();
});
IdeaSchema.post('findOneAndUpdate', function (error, doc, next) {
    next();
});

IdeaSchema.plugin(paginate);
    