import { IsArray, IsEmail, IsNotEmpty, IsString, MaxLength, MinLength , IsDate, IsOptional} from "class-validator";
import { Match } from "@common/decorators/validate.decorator";

export class RegisterAccountDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    password: string;

    @IsNotEmpty()
    @IsString()
    @Match("password", { message: "Password and confirm password does not match" })
    confirmPassword: string;

    @IsArray()
    roles: string[];

    @IsDate()
    @IsOptional()
    birthday: string = new Date().toISOString();

    @IsString()
    department: string;
}
