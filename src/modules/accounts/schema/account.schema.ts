import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { hashSync } from "bcryptjs";
import * as paginate from "mongoose-paginate-v2";
import { BCRYPT_SALT } from "@configs/env";
import Role, { RoleNames } from '@common/enums/role.enum';

export type AccountDocument = Account & Document;
@Schema({ timestamps: true })
export class Account {
    @Prop({
        trim: true
    })
    displayName: string;

    @Prop({
        required: true,
        trim: true,
        unique: true
    })
    username: string;

    @Prop({
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    })
    email: string;

    @Prop({
        trim: true,
        minlength: 8,
        maxlength: 32,
        select: false
    })
    password: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"
    })
    department: string;


    @Prop({
        enum: RoleNames,
        default: [Role.User],
        type: [{ type: mongoose.Schema.Types.String}],
    })
    roles: string;

    @Prop({
        required: true,
        type: mongoose.Schema.Types.Date,
    })
    birthday: Date;

    @Prop({
        trim: true,
        default: "https://i.imgur.com/Uoeie1w.jpg"
    })
    avatar: string;

    @Prop({
        trim: true
    })
    googleId: string;
}

export const AccountSchema = SchemaFactory.createForClass(Account);


AccountSchema.pre("save", async function (next) {
    const doc = this;
    this.populate("department");
    if (!doc.displayName) doc.displayName = doc.username;
    if (doc.isModified("password") && doc.password) doc.password = hashSync(doc.password, BCRYPT_SALT);
    next();
});

AccountSchema.pre("findOneAndUpdate", async function (next) {
    const doc = this;
    this.populate("department");

    if (doc["_update"] && doc["_update"]["password"]) doc["_update"]["password"] =
        hashSync(doc["_update"]["password"], BCRYPT_SALT);
    next();
});


AccountSchema.plugin(paginate);