import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class DepartmentDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

}