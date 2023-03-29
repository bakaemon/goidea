/* eslint-disable prefer-const */
import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { ConfigService } from "@nestjs/config";
import { compareSync } from "bcryptjs";
import { AccountsService } from "../accounts/accounts.service";
import TokenEnum, { TokenType } from "@src/common/enums/token.enum";
import { HttpService } from "@nestjs/axios";
import { RegisterAccountDto } from "@src/common/util/register-account-dto";
import { TokensService } from '../token/token.service';
import * as moment from "moment";
import { generateRandomUsername } from "@src/common/util/random";
import { AccountDocument } from "../accounts/schema/account.schema";



@Injectable()
export class AuthService {
    supportedServicesOAuth: string[] = ["google"];

    constructor(
        private configService: ConfigService,
        private accountService: AccountsService,
        private httpService: HttpService,
        private tokenService: TokensService
    ) {
    }


    async refreshToken(refreshToken: string) {
       
        
        const payload = await this.verifyToken(refreshToken, "jwt.refreshTokenPrivateKey");
        const access_token = this.generateToken({ accountId: payload.accountId }, "jwt.accessTokenPrivateKey", { expiresIn: this.configService.get("jwt.expiresTime.access") });
        //const new_refresh_token = this.authService.generateToken({ accountId: payload.accountId }, "jwt.accessTokenPrivateKey", { expiresIn: this.configService.get("jwt.expiresTime.refresh") });
        const { accessTokenExpiresAt } = await this.generateTokenExpiresTimes();
        const account = await this.accountService.findOne({ _id: payload.accountId });
        if (!account) {
            throw new HttpException("Account does not exist", HttpStatus.NOT_FOUND);
        }
        return {
            access_token,
            access_token_expires_at: accessTokenExpiresAt,
            account
        };
    }
    async register(registerAccountDto: RegisterAccountDto) {
        if (await this.accountService.count({ $or: [{ username: registerAccountDto.username }, { email: registerAccountDto.email }] }) > 0) throw new HttpException("This account is already exists", 500);
        const account = await this.accountService.create(registerAccountDto);
        // await this.generateVerifyTokenAndSendEmail(Token.EmailVerify, account);
        return account;
    }

    async authenticate(loginField: string, password: string) {
        let account = await this.accountService
            .findOne({ $or: [{ email: loginField }, { username: loginField }] }, { select: 'username email password'})

        // if (!account.isActivated) {
        //   await this.generateVerifyTokenAndSendEmail(Token.EmailVerify, account);
        //   throw new HttpException("verifyAccount", HttpStatus.INTERNAL_SERVER_ERROR);
        // }
        const check = await this.comparePassword(password, account.password);
        if (!account || !check) {
            throw new HttpException("Failed to login", HttpStatus.UNAUTHORIZED);
        }

        account = await this.accountService.findOne({ _id: account._id });
        return account;
    }


    async comparePassword(password: string, storePasswordHash: string): Promise<boolean> {
        return compareSync(password, storePasswordHash);
    }

    generateToken(payload: any, keyName: "jwt.accessTokenPrivateKey" | "jwt.refreshTokenPrivateKey", options?: jwt.SignOptions) {
        const privateKeyBase64 = this.configService.get(keyName);
        const privateKey = Buffer.from(privateKeyBase64, "base64").toString("ascii");
        return jwt.sign(payload, privateKey, {
            algorithm: "HS256",
            ...options
        });
    }

    async generateAuthTokens(payload: TokenPayload, account: AccountDocument) {
        const access_token = this.generateToken(payload, "jwt.accessTokenPrivateKey", { expiresIn: this.configService.get("jwt.expiresTime.access") });
        let refresh_token;

        let {
            accessTokenExpiresAt, refreshTokenExpiresAt
        } = await this.generateTokenExpiresTimes();


        if (payload.accountId) {
            refresh_token = this.generateToken({
                ...payload,
                type: "refresh"
            }, "jwt.refreshTokenPrivateKey", { expiresIn: this.configService.get("jwt.expiresTime.refresh") });

            await this.saveToken(
                refresh_token,
                account,
                "refresh",
                refreshTokenExpiresAt
            );
        }

        return {
            access_token,
            refresh_token,
            accessTokenExpiresAt,
            refreshTokenExpiresAt
        };
    }

    async saveToken(token: string, account: AccountDocument, type: TokenType, expiresAt?: Date) {
        await this.tokenService.create({
            token,
            account: account._id,
            expiresAt,
            type: type
        });
    }

    verifyToken(token: string, keyName: "jwt.accessTokenPrivateKey" | "jwt.refreshTokenPrivateKey"): any {
        try {
            const privateKeyBase64 = this.configService.get(keyName);
            const privateKey = Buffer.from(privateKeyBase64, "base64").toString("ascii");
            return jwt.verify(token, privateKey);
        } catch (e) {
            this.tokenService.deleteOne({ token }).then(_ => {
            });
            throw e;
        }
    }

    async verifyTokenFromRequest(token: string, keyName: "jwt.accessTokenPrivateKey" | "jwt.refreshTokenPrivateKey"): Promise<AccountDocument> {
        const payload = this.verifyToken(token, keyName || "jwt.accessTokenPrivateKey");

        const account = await this.accountService.findOne({ _id: payload.accountId }, { nullable: true });

        if (!account) {
            throw new HttpException("Account does not exist", HttpStatus.UNAUTHORIZED);
        }
        
        return account;

    }

    async generateTokenExpiresTimes(type?: TokenType) {
        const expiresTime = {};

        for (const type in TokenEnum) {
            expiresTime[TokenEnum[type]] = moment().add(
                parseInt(this.configService.get(`jwt.expiresTime.${TokenEnum[type]}`).match(/\d+/)[0]),
                this.configService.get(`jwt.expiresTime.${TokenEnum[type]}`).replace(/[^A-Za-z]/g, "")
            ).toDate();
        }

        return (type) ? expiresTime[type] : {
            accessTokenExpiresAt: expiresTime[TokenEnum.Access],
            refreshTokenExpiresAt: expiresTime[TokenEnum.Refresh],
            changePasswordTokenExpiresAt: expiresTime[TokenEnum.ChangePassword],
            success: true
        };
    }

    /* Demo */
    async getTokensFromOAuth(tokenUrl: string, authConfig: AuthConfig, authData: AuthData) {
        let body = {};

        switch (authConfig.grantType) {
            case "authorization_code":
                body = {
                    grant_type: authConfig.grantType,
                    redirect_uri: authConfig.redirectUri,
                    client_id: authConfig.clientID,
                    client_secret: authConfig.clientSecret,
                    code: authData.code
                };
                break;
            case "refresh_token":
                body = {
                    grant_type: authConfig.grantType,
                    client_id: authConfig.clientID,
                    client_secret: authConfig.clientSecret,
                    refresh_token: authData.refreshToken
                };
                break;
            default:
                throw new HttpException("Invalid grant type", HttpStatus.BAD_REQUEST);
        }

        try {
            const data = await this.httpService.axiosRef.post(tokenUrl, body, {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            });

            return data["data"];
        } catch (e: any) {
            console.log(e);
            throw new HttpException("Failed to retrieve token", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async authenticateWithSSO(service: string, ssoConfig: SSOConfig) {
        if (!this.supportedServicesOAuth.includes(service)) {
            throw new HttpException("Unsupported service", HttpStatus.BAD_REQUEST);
        }
        let tokenUrl, data, accountFromSSO, account;

        switch (service) {
            case "google":
                tokenUrl = `https://www.googleapis.com/oauth2/v4/token`;
                data = await this.getTokensFromOAuth(tokenUrl, {
                    clientID: this.configService.get("google.clientID"),
                    clientSecret: this.configService.get("google.clientSecret"),
                    grantType: ssoConfig.grantType,
                    redirectUri: ssoConfig.redirectUri
                }, {
                    code: ssoConfig.authorizationCode
                });


                accountFromSSO = (await this.httpService.axiosRef.get("https://www.googleapis.com/userinfo/v2/me", {
                    headers: {
                        Authorization: `Bearer ${data.access_token}`
                    }
                }))["data"];

                Object.assign(accountFromSSO, {
                    avatar: accountFromSSO.picture,
                    fullName: accountFromSSO.name,
                    type: "google"
                });

                break;
        }
        let randomUserName;

        account = await this.accountService.findOne({ [`${service}Id`]: accountFromSSO.id }, { nullable: true });
        if (!account) {
            account = await this.accountService.findOne({ email: accountFromSSO.email }, { nullable: true });

            if (account) {
                Object.assign(account, {
                    [`${service}Id`]: accountFromSSO.id,
                    isActivated: true
                });
                await account.save();
            } else {
                do {
                    randomUserName = generateRandomUsername(accountFromSSO.fullName);
                } while ((await this.accountService.count({ username: randomUserName })) > 0);

                account = await this.accountService.create({
                    email: accountFromSSO.email,
                    username: randomUserName,
                    displayName: accountFromSSO.fullName,
                    avatar: accountFromSSO.avatar
                });

                Object.assign(account, {
                    [`${service}Id`]: accountFromSSO.id,
                    isActivated: true,
                    avatar: accountFromSSO.avatar

                });
                await account.save();
            }
        }
        return account;
    }
}
