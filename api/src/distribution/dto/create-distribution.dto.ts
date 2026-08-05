import { IsString } from 'class-validator';

export class CreateDistributionDto {
    @IsString()
    formId!: string;
}
