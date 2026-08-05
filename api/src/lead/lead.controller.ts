import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Ip, UseGuards } from '@nestjs/common';
import { LeadService } from './lead.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';

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
    findAll() {
        return this.leadService.findAll();
    }
}
