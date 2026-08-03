import { PrismaService } from '@app/prisma/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) {}

    async authenticate(email: string, password: string) {
        const user = await this.prismaService.user.findFirst({
            where: {
                email,
            },
            select: {
                id: true,
                email: true,
                name: true,
                password: true,
            },
        });

        const isPasswordValid = await bcrypt.compare(password, user?.password || '');

        if (!user || !isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password. Please try again.');
        }

        return user;
    }

    async findOneById(userId: string) {
        const user = await this.prismaService.user.findFirst({
            where: {
                id: userId,
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });
        return user;
    }
}
