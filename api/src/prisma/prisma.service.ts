import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@generated/prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    constructor(private configService: ConfigService) {
        const url = new URL(configService.get<string>('database.url')!);

        const adapter = new PrismaMariaDb({
            host: url.hostname,
            port: url.port ? Number(url.port) : 3306,
            user: decodeURIComponent(url.username),
            password: decodeURIComponent(url.password),
            database: url.pathname.replace(/^\//, ''),
        });
        super({ adapter });
    }

    async onModuleInit() {
        await this.$connect();
    }
}