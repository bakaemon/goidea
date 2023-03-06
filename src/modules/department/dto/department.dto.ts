import { IsNotEmpty, IsOptional, IsString, IsEmpty, MaxLength, MinLength } from "class-validator";

export class DepartmentDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmpty()
    @IsString()
    description: string;

}