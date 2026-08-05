import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Length, Max, MaxLength, Min, min } from 'class-validator';

export class CreateLeadDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    name!: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(255)
    email!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    phone!: string;
}
