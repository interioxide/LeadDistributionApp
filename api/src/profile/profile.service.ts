import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PrismaService } from '@app/prisma/prisma.service';
import { DataResponseDto } from '@app/common/dto/data-response.dto';

@Injectable()
export class ProfileService {
    constructor(private prismaService: PrismaService) {}

    create(createProfileDto: CreateProfileDto) {
        return 'This action adds a new profile';
    }

    async me(id: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id,
            },
        });
        return new DataResponseDto(user);
    }

    findOne(id: string) {
        return `This action returns a #${id} profile`;
    }

    update(id: number, updateProfileDto: UpdateProfileDto) {
        return `This action updates a #${id} profile`;
    }

    remove(id: number) {
        return `This action removes a #${id} profile`;
    }
}
