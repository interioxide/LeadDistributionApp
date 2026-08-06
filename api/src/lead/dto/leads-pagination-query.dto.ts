import { PaginationQueryDto } from '@app/common/dto/pagination.dto';
import { IsOptional, IsString } from 'class-validator';

export class LeadsPaginationQueryDto extends PaginationQueryDto {
    @IsString()
    @IsOptional()
    brokerId?: string;
}
