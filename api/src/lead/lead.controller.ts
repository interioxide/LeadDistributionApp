import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Ip, UseGuards, Query } from '@nestjs/common';
import { LeadService } from './lead.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';
import { PaginationQueryDto } from '@app/common/dto/pagination.dto';

@Controller('leads')
export class LeadController {
    constructor(private readonly leadService: LeadService) {}

    @Post(':slug')
    create(@Body() createLeadDto: CreateLeadDto, @Ip() ipAddress: string, @Param('slug') slug: string) {
        return this.leadService.create({
            ipAddress,
            slug,
            ...createLeadDto,
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@Query() query: PaginationQueryDto) {
        return this.leadService.findAll(query);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':distributionId')
    findAllByDistribution(@Param('distributionId') distributionId: string, @Query() query: PaginationQueryDto) {
        return this.leadService.findAll(query, distributionId);
    }
}
