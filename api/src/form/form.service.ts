import { ConflictException, Injectable } from '@nestjs/common';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { PrismaService } from '@app/prisma/prisma.service';
import { DataResponseDto } from '@app/common/dto/data-response.dto';

@Injectable()
export class FormService {
    constructor(private prismaService: PrismaService) {}

    async create(createFormDto: CreateFormDto) {
        const form = await this.findOne();
        if (form.data) {
            throw new ConflictException('The form already exists.');
        }
        const response = await this.prismaService.form.create({
            data: createFormDto,
        });
        return new DataResponseDto(response);
    }

    async findOne() {
        const response = await this.prismaService.form.findFirst({
            orderBy: {
                createdAt: 'asc',
            },
        });
        return new DataResponseDto(response);
    }

    async findOneBySlug(slug: string) {
        const response = await this.prismaService.form.findFirst({
            where: {
                slug,
            },
        });
        return new DataResponseDto(response);
    }
}
