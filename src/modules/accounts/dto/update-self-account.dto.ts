import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf, IsDate, IsArray } from 'class-validator';
import { RoleName, RoleNames } from "@common/enums/role.enum";
import { Department } from '../../department/schema/department.schema';

export class UpdateAccountDto {
    @IsString()
    displayName?: string;

    @IsString()
    username: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsDate()
    @IsNotEmpty()
    birthday: Date;

    @IsString()
    department: string;

    @IsOptional()
    @IsArray()
    @IsEnum(RoleNames, { each: true })
    roles?: string[];
}

export class UpdateSelfAccountDto {

    @IsString()
    displayName: string;
}