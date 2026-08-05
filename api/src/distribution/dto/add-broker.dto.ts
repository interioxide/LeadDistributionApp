import { IsBoolean, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class AddBrokerDto {
    @IsString()
    brokerId!: string;

    @IsNumber()
    @Min(1)
    @Max(100)
    percentage!: number;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
