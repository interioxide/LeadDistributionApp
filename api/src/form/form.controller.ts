import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException, UseGuards } from '@nestjs/common';
import { FormService } from './form.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';
import { JwtAuthGuard } from '@app/auth/guards/jwt-auth.guard';

@Controller('form')
export class FormController {
    constructor(private readonly formService: FormService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async create(@Body() createFormDto: CreateFormDto) {
        return this.formService.create(createFormDto);
    }

    @Get()
    findOne() {
        return this.formService.findOne();
    }
}
