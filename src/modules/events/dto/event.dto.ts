import { IsNotEmpty, IsOptional, IsString, IsEmpty, MaxLength, MinLength } from "class-validator";

export class EventDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    closureDate: Date;

    @IsString()
    @IsNotEmpty()
    finalClosureDate: Date;

    @IsString()
    @IsNotEmpty()
    department: string;

    @IsString()
    @IsNotEmpty()
    category: string;

}

export class EventUpdateDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsString()
    closureDate: Date;

    @IsString()
    department: string;

    @IsString()
    category: string;

}