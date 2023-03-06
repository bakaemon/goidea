import { MongooseModule } from "@nestjs/mongoose";
import { Global, Module } from "@nestjs/common";
import { AccountSchema } from "@src/modules/accounts/schema/account.schema";
import { DefaultAccount } from "../util/default-account";
import { TokenSchema } from "@src/modules/token/schema/token.schema";
import { CategorySchema } from "@src/modules/category/schema/category.schema";
import { TagSchema } from '../../modules/tag/schema/tag.schema';
import { DepartmentSchema } from "@src/modules/department/schema/department.schema";

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: "Account", schema: AccountSchema
            },
            {
                name: "Token", schema: TokenSchema
            },
            {
                name: "Department", schema: DepartmentSchema
            },
            {
                name: "Category", schema: CategorySchema
            },
            {
                name: "Tag", schema: TagSchema
            },
            

        ]),
        MongooseModule.forFeatureAsync([
            {
                name: "Account",
                useFactory: () => {
                    const schema = AccountSchema;
                    const accountModel = new DefaultAccount(schema);
                    accountModel.generate().then(_ => { });
                    return schema;
                }
            }
        ])
    ],

    exports: [
        MongooseModule.forFeature([
            {
                name: "Account", schema: AccountSchema
            }, {
                name: "Token", schema: TokenSchema
            },
            {
                name: "Department", schema: DepartmentSchema
            },
            {
                name: "Category", schema: CategorySchema
            },
            {
                name: "Tag", schema: TagSchema
            },
        ])
    ]
})
export class DatabaseModule {
}
