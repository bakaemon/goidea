import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import * as paginate from 'mongoose-paginate-v2';

export type CommentDocument = Comment & mongoose.Document;

@Schema({ timestamps: true })
class Comment {
    @Prop({ required: true })
    content: string;
    
    @Prop({ 
        required: true,
        ref: 'Account',
        type: mongoose.Schema.Types.ObjectId}
        )
    author: string;

    @Prop({ 
        required: true,
        ref: 'Idea',
        type: mongoose.Schema.Types.ObjectId
    })
    idea: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }] })
    upvoter: string[];

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }] })
    downvoter: string[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.plugin(paginate)