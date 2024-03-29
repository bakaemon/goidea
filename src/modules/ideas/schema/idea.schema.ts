import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { VotesSchema, VotesDocument } from './votes.schema';
import * as paginate from "mongoose-paginate-v2";
import { ConflictException } from "@nestjs/common";
import { Flag, FlagNames } from "@src/common/enums/flag.enum";

export type IdeaDocument = Idea & Document;

@Schema({ timestamps: true })
export class Idea {
    @Prop({  })
    title: string;

    @Prop({  })
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
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Tag"
    })
    tags: string[];

    @Prop({
        required: true,
        ref: "Category",
        type: mongoose.Schema.Types.ObjectId
    })
    category: string;

    // is anonymous
    @Prop({ default: false })
    anonymous: boolean;

    @Prop({
        type: [mongoose.Schema.Types.String],
        enum: FlagNames,
        default: [Flag.Queue]
    })
    flag: string[];

    @Prop ({
        type: [mongoose.Schema.Types.String],
        default: []
    })
    files: string[];

    
    // comment notification email to author if it's true
    @Prop({ default: false })
    isNotified: boolean;

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
    