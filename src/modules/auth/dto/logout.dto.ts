import { IsOptional, IsString } from "class-validator";

export class LogoutDto {
    @IsOptional()
    @IsString()
    token: string;

    @IsString()
    refreshToken: string;

}
