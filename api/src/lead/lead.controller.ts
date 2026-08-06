import { Controller, Get, Post, Body, Param, Ip, UseGuards, Query, Req } from '@nestjs/common';
import { LeadService } from './lead.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';
import { PaginationQueryDto } from '@app/common/dto/pagination.dto';
import { AssignLeadDto } from './dto/assign-lead.dto';
import { LeadsPaginationQueryDto } from './dto/leads-pagination-query.dto';
import type { Request } from 'express';

@Controller('leads')
export class LeadController {
    constructor(private readonly leadService: LeadService) {}

    @Post(':slug')
    create(@Body() createLeadDto: CreateLeadDto, @Param('slug') slug: string, @Req() req: Request) {
        const ip = req.headers['x-real-ip'] || req.socket.remoteAddress || '';

        return this.leadService.create({
            ipAddress: ip.toString(),
            slug,
            ...createLeadDto,
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@Query() query: LeadsPaginationQueryDto) {
        return this.leadService.findAll(query);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':distributionId')
    findAllByDistribution(@Param('distributionId') distributionId: string, @Query() query: PaginationQueryDto) {
        return this.leadService.findAll(query, distributionId);
    }

    @UseGuards(JwtAuthGuard)
    @Post(':id/assign')
    assignLead(@Param('id') id: string, @Body() assignLeadDto: AssignLeadDto) {
        return this.leadService.assignLead(id, assignLeadDto.brokerId);
    }
}
