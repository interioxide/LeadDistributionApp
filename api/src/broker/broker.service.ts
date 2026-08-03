import { Injectable } from '@nestjs/common';
import { CreateBrokerDto } from './dto/create-broker.dto';
import { UpdateBrokerDto } from './dto/update-broker.dto';
import { PaginationMetaDataDto, PaginationQueryDto, PaginationResponseDto } from '@app/common/dto/pagination.dto';
import { PrismaService } from '@app/prisma/prisma.service';
import { BrokerWhereInput } from '@generated/prisma/models';

@Injectable()
export class BrokerService {
    constructor(private prismaService: PrismaService) {}

    create(createBrokerDto: CreateBrokerDto) {
        return 'This action adds a new broker';
    }

    async findAll(query: PaginationQueryDto) {
        const { page, limit, offset, search } = query;
        const whereInput: BrokerWhereInput = {
            name: {
                contains: search
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

    findOne(id: number) {
        return `This action returns a #${id} broker`;
    }

    update(id: number, updateBrokerDto: UpdateBrokerDto) {
        return `This action updates a #${id} broker`;
    }

    remove(id: number) {
        return `This action removes a #${id} broker`;
    }
}
