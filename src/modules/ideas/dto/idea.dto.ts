import { IsString } from 'class-validator';
export class IdeaDto {
    @IsString()
    title: string;
    
    @IsString()
    description: string;

    @IsString()
    category: string;

    @IsString()
    author: string;

    @IsString()
    assignee: string;

    @IsString()
    approver: string;

    
}