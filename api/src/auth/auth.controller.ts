import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from './dto/sign-in.dto';
import type { CookieOptions, Request, Response } from 'express';
import ms, { StringValue } from 'ms';

@Controller('auth')
export class AuthController {
    private accessTokenCookieOptions: CookieOptions;

    constructor(
        private readonly authService: AuthService,
        private configService: ConfigService,
    ) {
        this.accessTokenCookieOptions = {
            httpOnly: true,
            secure: configService.get<boolean>('responseCookie.secure'),
            sameSite: 'none',
            path: '/',
            domain: configService.get<string>('responseCookie.domain'),
            maxAge: ms(configService.get<string>('accessToken.expiration') as StringValue),
        };
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() dto: SignInDto, @Req() request: Request, @Res({ passthrough: true }) response: Response) {
        const signIn = await this.authService.signIn({
            email: dto.email,
            password: dto.password,
        });

        response.cookie('accessToken', signIn.accessToken, this.accessTokenCookieOptions);
        return signIn;
    }

    @HttpCode(HttpStatus.OK)
    @Post('logout')
    async logout(@Res({ passthrough: true }) response: Response) {
        response.clearCookie('accessToken', this.accessTokenCookieOptions);
        return {
            message: 'Logged out successfully.',
        };
    }
}
