import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { DistributionService } from './distribution.service';
import { AddBrokerDto } from './dto/add-broker.dto';
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';
import { PaginationQueryDto } from '@app/common/dto/pagination.dto';
import { SaveSettingsDto } from './dto/save-settings.dto';

@UseGuards(JwtAuthGuard)
@Controller('distribution')
export class DistributionController {
    constructor(private readonly distributionService: DistributionService) {}

    @Post()
    create() {
        return this.distributionService.create();
    }

    @Get()
    findOne() {
        return this.distributionService.findOne();
    }

    @Patch('broker')
    addBroker(@Body() addBrokerDto: AddBrokerDto) {
        return this.distributionService.addBroker(addBrokerDto);
    }

    @Get('brokers')
    findAll(@Query() query: PaginationQueryDto) {
        return this.distributionService.findBrokers(query);
    }

    @Delete(':brokerId')
    remove(@Param('brokerId') brokerId: string) {
        return this.distributionService.removeBroker(brokerId);
    }

    @Post('settings')
    saveSettings(@Body() saveSettingsDto: SaveSettingsDto) {
        return this.distributionService.saveSettings(saveSettingsDto);
    }
}
