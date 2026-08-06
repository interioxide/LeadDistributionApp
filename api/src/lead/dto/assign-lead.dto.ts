import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Length, Max, MaxLength, Min, min } from 'class-validator';

export class AssignLeadDto {
    @IsString()
    @IsNotEmpty()
    brokerId!: string;
}
