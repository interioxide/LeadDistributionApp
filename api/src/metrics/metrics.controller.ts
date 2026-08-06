import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';

@Controller('metrics')
export class MetricsController {
    constructor(private readonly metricsService: MetricsService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    metrics() {
        return this.metricsService.metrics();
    }
}
