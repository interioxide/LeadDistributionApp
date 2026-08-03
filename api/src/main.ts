import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const allowedOrigins = configService.get<string>('cors.allowedOrigins') || '';

    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    // Securities
    app.enableCors({
        origin: allowedOrigins.split(','),
        credentials: true,
    });
    app.use(helmet());
    app.use(compression());

    await app.listen(configService.get<number>('port') ?? 3000);
}
bootstrap();
