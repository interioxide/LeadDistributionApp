import { Injectable } from '@nestjs/common';
import { CreateBrokerDto } from './dto/create-broker.dto';
import { UpdateBrokerDto } from './dto/update-broker.dto';
import { PaginationMetaDataDto, PaginationQueryDto, PaginationResponseDto } from '@app/common/dto/pagination.dto';
import { PrismaService } from '@app/prisma/prisma.service';
import { BrokerWhereInput } from '@generated/prisma/models';
import { DataResponseDto } from '@app/common/dto/data-response.dto';

@Injectable()
export class BrokerService {
    constructor(private prismaService: PrismaService) {}

    async create(createBrokerDto: CreateBrokerDto) {
        const workingDays = createBrokerDto.workingDays?.join(',');
        const response = await this.prismaService.broker.create({
            data: {
                ...createBrokerDto,
                workingDays,
            },
        });
        return new DataResponseDto(response);
    }

    async findAll(query: PaginationQueryDto) {
        const { page, limit, offset, search } = query;
        const whereInput: BrokerWhereInput = {
            name: {
                contains: search,
            },
        };
        const [data, totalItems] = await Promise.all([
            this.prismaService.broker.findMany({
                skip: offset,
                take: limit,
                where: whereInput,
                orderBy: {
                    ...(query.orderBy && query.orderDirection && { [query.orderBy]: query.orderDirection }),
                },
            }),
            this.prismaService.broker.count({
                where: whereInput,
            }),
        ]);
        const metadata = new PaginationMetaDataDto(page, limit, totalItems);
        return new PaginationResponseDto(data, metadata);
    }

    async findOne(id: string) {
        const response = await this.prismaService.broker.findUnique({
            where: { id },
        });
        return new DataResponseDto(response);
    }

    async update(id: string, updateBrokerDto: UpdateBrokerDto) {
        const workingDays = updateBrokerDto.workingDays?.join(',');
        const response = await this.prismaService.broker.update({
            where: { id },
            data: {
                ...updateBrokerDto,
                workingDays,
            },
        });
        return new DataResponseDto(response);
    }

    remove(id: string) {
        return `This action removes a #${id} broker`;
    }
}
