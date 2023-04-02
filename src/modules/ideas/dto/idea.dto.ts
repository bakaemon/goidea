import { IsString , IsBoolean, IsArray} from 'class-validator';
import { FileTypeValidator, MaxFileSizeValidator, ParseFilePipe, UploadedFile } from '@nestjs/common';

export class IdeaDto {
    @IsString()
    title: string;
    
    @IsString()
    description: string;

    @IsString()
    author: string;

    @IsString()
    event: string;

    @IsBoolean()
    anonymous: boolean;

    @IsArray()
    tags: string;

    @IsArray()
    flag: string[];

    @IsString()
    file?: string;
}