import { IsArray, IsBoolean, IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateBrokerDto {
    @IsString()
    name!: string;

    @IsBoolean()
    isActive!: boolean;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    dailyCap!: number;

    @IsString()
    timezone!: string;

    @IsString()
    openingTime!: string; // HH:mm

    @IsString()
    closingTime!: string; // HH:mm

    @IsArray()
    @IsIn(['1', '2', '3', '4', '5', '6', '7'], { each: true })
    workingDays!: string[];
}
