import { Post, Res, Body, HttpStatus, HttpException, Req, UseGuards, Controller, Delete } from '@nestjs/common';
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

    @Post("login")
    async login(@Body() loginDto: LoginDto, @Res({passthrough: true}) res) {
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
            
            return response;
        } catch (e) {
            console.log(e);
            if (e.message === "verifyAccount") throw new HttpException("Please verify your email to continue", HttpStatus.INTERNAL_SERVER_ERROR);
            else throw new HttpException("Login failed", HttpStatus.UNAUTHORIZED);
        }
    }


    @Post("refresh")
    async refresh_token(@Req() req, @Res() res) {

        let refresh_token;
        if (req.body.refresh_token) {
            refresh_token = await this.tokenService.findOne({ token: req.body.refresh_token });
            if (!refresh_token) {
                throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
            }
        }

        const payload = await this.authService.verifyToken(refresh_token.token, "jwt.refreshTokenPrivateKey");
        const access_token = this.authService.generateToken({ accountId: payload.accountId }, "jwt.accessTokenPrivateKey", { expiresIn: this.configService.get("jwt.expiresTime.access") });

        const { accessTokenExpiresAt } = await this.authService.generateTokenExpiresTimes();

        const account = await this.accountService.findOne({ _id: payload.accountId });
        if (!account) {
            throw new HttpException("Account does not exist", HttpStatus.NOT_FOUND);
        }
        return res.status(HttpStatus.OK).json({
            access_token, access_token_expires_at: accessTokenExpiresAt, account, success: true
        });
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

    @Delete("admin_remove")
    @UseGuards(RoleGuard(Role.Admin))
    async removeAccount(@Body() { accountId }: { accountId: string }, @AccountDecorator() account: AccountDocument) {
        const id = account._id as ObjectId;
        if (id.toString() == accountId) {
            throw new HttpException("You can not remove yourself.", HttpStatus.BAD_REQUEST);
        }
        await this.accountService.delete({ _id: accountId });
        return {
            message: "Remove account successfully",
            success: true
        };
    }
}
