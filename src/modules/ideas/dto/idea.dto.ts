import { IsString , IsBoolean, IsArray} from 'class-validator';
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
    tags: string[];

    @IsArray()
    flag: string[];


    
}