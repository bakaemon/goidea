import { Body, Controller, Post, Res, HttpStatus, Get, Param, Query } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { AccountsService } from "@src/modules/accounts/accounts.service";
import { TokensService } from "@src/modules/token/token.service";
import { AuthService } from "./auth.service";
import { Response } from "express";

@Controller()
export class AuthController {
    constructor(
        private authService: AuthService,
        private accountService: AccountsService,
        private configService: ConfigService,
        private tokenService: TokensService,
    ) {
    }

    @Get("verify")
    async verify(@Query('token') token: string , @Res({ passthrough: true }) res : Response) {
        try {
            const account = await this.authService.verifyTokenFromRequest(token, "jwt.accessTokenPrivateKey");
            res.cookie("token", token, { httpOnly: false, maxAge: 1000 * 60 * 30 });
            return res.status(HttpStatus.ACCEPTED).redirect("/");
        } catch (e) {
            throw e;
        }
    }
}