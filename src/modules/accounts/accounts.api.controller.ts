import { Body, Controller, Delete, FileTypeValidator, Get, HttpException, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Patch, Post, Query, Res, UploadedFile, UseGuards } from "@nestjs/common";
import { AccountsService } from "./accounts.service";
import Role from "@src/common/enums/role.enum";
import { FindAccountFilterDto } from "@src/common/filters/find-account-filter.dto";
import RoleGuard from "@src/common/guards/role.guard";
import { PaginationParamsDto } from "@src/common/dto/pagination-params.dto";
import { AuthGuard } from "@src/common/guards/auth.guard";
import { AccountDecorator } from "@src/common/decorators/account.decorator";
import { AccountDocument } from "./schema/account.schema";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { AuthService } from "../auth/auth.service";
import { randomString } from "@src/common/util/random";
import { Express, Response } from "express";
import { UpdateSelfAccountDto, UpdateAccountDto } from "./dto/update-self-account.dto";
import { ObjectId } from 'mongoose';
import * as mongoose from 'mongoose';

@Controller('api')
export class AccountsAPIController {
    constructor(
        private readonly accountsService: AccountsService,
        private readonly authService: AuthService,
    
    ) { }
    
    @Get('all')
    @UseGuards(RoleGuard(Role.Admin, Role.QAM))
    getAccounts(
        @Query() filter: FindAccountFilterDto,
        @Query('month') month: number,
        @Query() options: PaginationParamsDto
    ) {
        try {
            if (month) {
                filter['$expr'] =  { $eq: [{ $month: '$createdAt' }, month] }
            }
            return this.accountsService.findAll(filter,{
                populate: {
                    path: "department",
                },
                select: "username email birthday roles department",
                ...options
            });
        } catch (error) {
            return {
                message: error.message
            }
        }
    }


    @Get("info")
    @UseGuards(AuthGuard)
    async getInfo(@AccountDecorator() account: AccountDocument) {
        return account;
    }

    @Post("change_password")
    @UseGuards(AuthGuard)
    async changePassword(
        @AccountDecorator() account: AccountDocument,
        @Body() changePasswordDto: ChangePasswordDto
    ) {
        if (changePasswordDto.currentPassword === changePasswordDto.newPassword) {
            throw new HttpException("Old and new passwords must be different", HttpStatus.BAD_REQUEST);
        }

        const { password } = await this.accountsService.findOne({ _id: account._id }, { select: "password" });

        if (password && !(await this.authService.comparePassword(changePasswordDto.currentPassword, password))) {
            throw new HttpException("Current password is incorrect", HttpStatus.BAD_REQUEST);
        }

        await this.accountsService.update({ _id: account._id }, { password: changePasswordDto.newPassword }, { new: true });

        return {
            message: "Changed password successfully"
        };
    }
    @Patch("me")
    @UseGuards(AuthGuard)
    updateSelf(
        @AccountDecorator() account: AccountDocument,
        @Body() updateAccountDto: UpdateSelfAccountDto
    ) {
        return this.accountsService.update({ _id: account._id }, updateAccountDto, { new: true });
    }

    @Get('get')
    async getById(@Query('id') id: string, @Res() res: Response) {
        try {
            const data = await this.accountsService.
                findOne({ _id: new mongoose.Types.ObjectId(id) }, { select: 'username email birthday roles department' });
            return res.status(200)
                .json(data);
        }
        catch (error) {
            return res.status(400).json({
                message: error.message,
            })
        }

    }

    @Patch(":id")
    @UseGuards(RoleGuard(Role.Admin))
    async update(
        @Param("id") id: string,
        @Body() updateAccountDto: UpdateAccountDto,
        @Res() res: Response
    ) {

        var account = await this.accountsService.findOne({ _id: id });
        if (!account) {
            return res.status(400).json({
                message: "Account not found",
                success: false
            });
        }
        account.displayName = updateAccountDto.displayName;
        account.email = updateAccountDto.email;
        account.birthday = updateAccountDto.birthday;
        account.roles = updateAccountDto.roles;
        account.department = updateAccountDto.department;
        account.username = updateAccountDto.username;
        await account.save();
        return res.status(200).json({
            message: "Update account successfully",
            success: true
            });
    }

    @Delete("admin_remove")
    @UseGuards(RoleGuard(Role.Admin))
    async removeAccount(@Body() { accountId }: { accountId: string }, @AccountDecorator() account: AccountDocument) {
        const id = account._id as ObjectId;
        if (id.toString() == accountId) {
            throw new HttpException("You can not remove yourself.", HttpStatus.BAD_REQUEST);
        }
        const target = await this.accountsService.findOne({ _id: accountId }, { select: "roles" })
        if (target.roles.includes(Role.Admin)) {
            throw new HttpException("You can not remove admin account.", HttpStatus.FORBIDDEN);
        }
        await this.accountsService.delete({ _id: accountId });
        return {
            message: "Remove account successfully",
            success: true
        };
    }
}