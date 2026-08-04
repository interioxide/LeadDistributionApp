import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { BrokerService } from './broker.service';
import { CreateBrokerDto } from './dto/create-broker.dto';
import { UpdateBrokerDto } from './dto/update-broker.dto';
import { PaginationQueryDto } from '@app/common/dto/pagination.dto';
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('brokers')
export class BrokerController {
    constructor(private readonly brokerService: BrokerService) {}

    @Post()
    create(@Body() createBrokerDto: CreateBrokerDto) {
        return this.brokerService.create(createBrokerDto);
    }

    @Get()
    findAll(@Query() query: PaginationQueryDto) {
        return this.brokerService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.brokerService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateBrokerDto: UpdateBrokerDto) {
        return this.brokerService.update(id, updateBrokerDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.brokerService.remove(id);
    }
}
