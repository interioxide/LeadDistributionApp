import { IsNumber, IsString, Max, Min } from 'class-validator';

export class RemoveBrokerDto {
    @IsString()
    brokerId!: string;
}
