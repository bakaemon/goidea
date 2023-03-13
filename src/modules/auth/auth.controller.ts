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
}