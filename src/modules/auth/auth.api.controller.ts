import { Post, Res, Body, HttpStatus, HttpException, Req, UseGuards, Controller, Delete, Get, Query } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { AccountDecorator } from "@src/common/decorators/account.decorator";
import TokenEnum from "@src/common/enums/token.enum";
import { AuthGuard } from "@src/common/guards/auth.guard";
import { AccountsService } from "../accounts/accounts.service";
import { AccountDocument } from "../accounts/schema/account.schema";
import { TokensService } from "../token/token.service";
import { AuthService } from "./auth.service";
import { LoginWithSsoDto } from "./dto/login-with-sso.dto";
import { LoginDto } from "./dto/login.dto";
import { LogoutDto } from "./dto/logout.dto";
import { RegisterAccountDto } from "./dto/register.dto";
import { ForgetPasswordDto } from "./dto/forget-password.dto";
import Role from '@src/common/enums/role.enum';
import RoleGuard from '@src/common/guards/role.guard';
import { Request } from 'express';
import { ObjectId } from 'mongoose';
import { Response } from 'express';


@Controller('api')
export class AuthAPIController {
    constructor(
        private authService: AuthService,
        private accountService: AccountsService,
        private configService: ConfigService,
        private tokenService: TokensService,
    ) {
    }

    @Post("sso")
    async loginWithSSO(@Res() res, @Body() loginWithSSODto: LoginWithSsoDto) {
        const account = await this.authService.authenticateWithSSO(loginWithSSODto.service, {
            grantType: loginWithSSODto.grantType,
            redirectUri: loginWithSSODto.redirectUri,
            authorizationCode: loginWithSSODto.authorizationCode
        });

        const { access_token, refresh_token } = await this.authService.generateAuthTokens({
            // teamId:
            accountId: account._id
        }, account);
        const {
            accessTokenExpiresAt, refreshTokenExpiresAt
        } = await this.authService.generateTokenExpiresTimes();

        await this.tokenService.create({
            token: refresh_token,
            account,
            expiresAt: refreshTokenExpiresAt,
            type: "refresh"
        });
        return res.status(HttpStatus.OK).json({
            access_token,
            access_token_expires_at: accessTokenExpiresAt,
            refresh_token,
            account,
            success: true
        });
    }

    @Post("register")
    async register(@Body() registerAccountDto: RegisterAccountDto) {
        try {
            await this.authService.register(registerAccountDto);
            return {
                message: "Register account successfully, you can login now.",
                success: true
            };
        }
        catch (e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // @Post("forget_password")
    // async forgetPassword(
    //     @Body() forgetPasswordDto: ForgetPasswordDto
    // ) {
    //     const account = await this.accountService.findOne(forgetPasswordDto, { nullable: true });

    //     if (account) await this.authService.generateVerifyTokenAndSendEmail(TokenEnum.ChangePassword, account);

    //     return {
    //         message: "A confirmation email was sent, please check your inbox to reset your password."
    //     };
    // }

    @Get("verify_token")
    async verifyToken(
        @Query("token") token: string,
        @Res() res: Response
    ) {
        res.json(await this.authService.verifyTokenFromRequest(token, "jwt.accessTokenPrivateKey"));
    }


    @Post("login")
    async login(@Body() loginDto: LoginDto, @Res({passthrough: true}) res: Response) {
        try {

            const account = await this.authService.authenticate(loginDto.loginField, loginDto.password);
            if (!account) {
                throw new HttpException("Login failed", HttpStatus.NOT_FOUND);
            }

            const payload = {
                accountId: account._id
            };
            const {
                access_token,
                refresh_token,
                accessTokenExpiresAt
            } = await this.authService.generateAuthTokens(payload, account);

            const response = {
                access_token,
                access_token_expires_at: accessTokenExpiresAt,
                refresh_token,
                account,
                success: true
            };
            res.cookie("token", access_token, { maxAge: 1000 * 60 * 30 });
            res.cookie("refresh_token", refresh_token, { maxAge: 1000 * 60 * 60 * 24 * 14});
            return response;
        } catch (e) {
            console.log(e);
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
            //if (e.message === "verifyAccount") throw new HttpException("Please verify your email to continue", HttpStatus.INTERNAL_SERVER_ERROR);
            //else throw new HttpException("Login failed", HttpStatus.UNAUTHORIZED);
        }
    }


    @Post("refresh")
    async refresh_token(@Req() req, @Res() res) {
        try {
            if (!req.body.refresh_token) {
                throw new HttpException("Refresh token is required", HttpStatus.NOT_ACCEPTABLE);
            }
            const token = await this.tokenService.findOne({ token: req.body.refresh_token });
            if (!token) {
                throw new HttpException("Can't find token", HttpStatus.NOT_ACCEPTABLE);
            }
            const { access_token,
                access_token_expires_at,
                account } = await this.authService.refreshToken(token.token);
            // await token.updateOne({ token: new_refresh_token });
            res.cookie("token", access_token);
            //res.cookie("refresh_token", new_refresh_token);
            return res.status(HttpStatus.OK).json({
                access_token,
                access_token_expires_at,
                // refresh_token: new_refresh_token,
                account,
                success: true
            });
        }
        catch (e) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: e.message,
                success: false
            });
        }
    }

    @Post("logout")
    @UseGuards(AuthGuard)
    async logout(@Body() logoutDto: LogoutDto, @AccountDecorator() account: AccountDocument) {

        await this.tokenService.deleteOne({
            author: account._id,
            token: logoutDto.refreshToken
        });

        return {
            message: "Log out successfully"
        };
    }


}
