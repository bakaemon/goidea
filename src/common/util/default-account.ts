import { Logger } from "@nestjs/common";
import { MONGO_URI, DEFAULT_ACCOUNT_USERNAME, DEFAULT_ACCOUNT_EMAIL, DEFAULT_ACCOUNT_PASSWORD } from "@src/configs/env";
import { AccountDocument } from "@src/modules/accounts/schema/account.schema";
import mongoose, { Model } from "mongoose";

export class DefaultAccount {
    private connection;
    private accountModel: Model<AccountDocument>;

    constructor(AccountSchema) {
        this.accountModel = mongoose.model("accounts", AccountSchema);
    }

    generate = async () => {
        mongoose.set("strictQuery", false);
        this.connection = await mongoose.connect(MONGO_URI);
        if (await this.accountModel.countDocuments({}) <= 0) {
            try {
                await this.accountModel.create({
                    username: DEFAULT_ACCOUNT_USERNAME,
                    email: DEFAULT_ACCOUNT_EMAIL,
                    password: DEFAULT_ACCOUNT_PASSWORD,
                    roles: ["admin"],
                    department: null,
                    isActivated: true
                });
            } catch (e) {
                Logger.error(e);
            }
            await mongoose.disconnect();
        }
    };
}