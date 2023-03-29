import { AccountDocument } from '@modules/accounts/schema/account.schema';
import { BaseService } from '@src/common/service/base.service';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';

@Injectable()
export class AccountsService extends BaseService<AccountDocument> {
    constructor(@InjectModel("Account") private accountModel: PaginateModel<AccountDocument>) {
        super(accountModel);
    }

    async create(account: Partial<AccountDocument>) {
        return await this.accountModel.create({
            email: account.email,
            username: account.username,
            password: account.password,
            roles: account.roles,
            department: account.department,
            birthday: account.birthday,
        });
    }
}