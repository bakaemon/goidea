import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf, IsDate } from "class-validator";
import { RoleName, RoleNames } from "@common/enums/role.enum";
import { Department } from '../../department/schema/department.schema';

export class UpdateAccountDto {
    @IsOptional()
    @IsBoolean()

   
    @IsString()
    displayName?: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsDate()
    @IsNotEmpty()
    birthday: Date;

    @IsString()
    department: string;

    @IsOptional()
    @IsEnum(RoleNames)
    role?: RoleName;
}

export class UpdateSelfAccountDto {

    @IsString()
    displayName: string;
}