import { IsArray, ValidateNested } from 'class-validator';
import { AddBrokerDto } from './add-broker.dto';
import { Type } from 'class-transformer';

export class SaveSettingsDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AddBrokerDto)
    brokers!: AddBrokerDto[];
}
