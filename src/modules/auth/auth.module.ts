import { Global, Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { DatabaseModule } from "@src/common/database_module/database.module";
import {AuthAPIController } from './auth.api.controller';
import { AuthService } from "./auth.service";
import { HttpModule } from "@nestjs/axios";
import { TokensService } from '../token/token.service';
import { AuthController } from "./auth.controller";

@Global()
@Module({
    controllers: [AuthController, AuthAPIController],
    providers: [AuthService],
    exports: [AuthService],
    imports: [
        HttpModule,
        RouterModule.register([
            {
                path: 'auth',
                module: AuthModule,
            },
        ])]
})
export class AuthModule {
}