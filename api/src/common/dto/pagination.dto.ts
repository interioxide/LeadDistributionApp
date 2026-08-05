import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { DataResponseCollectionDto } from './data-response-collection.dto';

export class PaginationQueryDto {
    @IsString()
    @IsOptional()
    search?: string;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(1000)
    limit: number = 10;

    @IsString()
    orderBy?: string = 'id';

    @IsString()
    orderDirection?: string = 'asc';

    constructor() {}

    get offset(): number {
        return (this.page - 1) * this.limit;
    }
}

export class ProductPaginationQueryDto extends PaginationQueryDto {
    @IsString()
    @IsOptional()
    categoryId?: string;
}

export class PaginationMetaDataDto {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;

    constructor(page: number, limit: number, totalItems: number) {
        this.page = page;
        this.limit = limit;
        this.totalItems = totalItems;
        this.totalPages = Math.ceil(totalItems / limit);
        this.hasNextPage = page < this.totalPages;
        this.hasPreviousPage = page > 1;
    }
}

export class PaginationResponseDto<T> extends DataResponseCollectionDto<T> {
    metadata: PaginationMetaDataDto;

    constructor(data: T[], metadata: PaginationMetaDataDto) {
        super(data);
        this.metadata = metadata;
    }
}
