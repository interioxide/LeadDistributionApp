import { PrismaService } from '@app/prisma/prisma.service';
import { UserService } from '@app/user/user.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import ms, { StringValue } from 'ms';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService,
    ) {}

    async signIn(signInDto: SignInDto): Promise<any> {
        const { email, password } = signInDto;
        const authUser = await this.userService.authenticate(email, password);
        const { password: passwordHash, ...user } = authUser;

        // Generate JWT Access Token.
        const accessToken = await this.jwtService.signAsync({
            id: user.id,
        });

        return {
            ...user,
            accessToken,
        };
    }
}
