import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import appConfig from './config/app.config';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';
import { BrokerModule } from './broker/broker.module';
import { FormModule } from './form/form.module';
import { DistributionModule } from './distribution/distribution.module';
import { LeadModule } from './lead/lead.module';
import { MetricsModule } from './metrics/metrics.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig],
        }),
        PrismaModule,
        AuthModule,
        UserModule,
        ProfileModule,
        BrokerModule,
        FormModule,
        DistributionModule,
        LeadModule,
        MetricsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
