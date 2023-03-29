import { SchemaFactory, Schema, Prop } from "@nestjs/mongoose";
import mongoose from "mongoose";

export type VotesDocument = Votes & Document;

@Schema({ timestamps: true })
export class Votes {
    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Idea"
    })
    idea: string;

    @Prop({
        required: true,
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Account"
    })
    upvoter: string[];

    @Prop({
        required: true,
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Account"
    })
    downvoter: string[];

}

export const VotesSchema = SchemaFactory.createForClass(Votes);
