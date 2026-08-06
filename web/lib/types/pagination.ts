import { PaginationState, SortingState } from '@tanstack/react-table';

export type SearchQuery = {
    search?: string;
    pagination?: PaginationState;
    sorting?: SortingState;
    brokerId?: string;
};

export interface PaginationMetadata {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

/**
 * Main API response wrapper
 */
export interface PaginatedResponse<T> {
    data: T[];
    metadata: PaginationMetadata;
}
