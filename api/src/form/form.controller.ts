import { Controller, Get, Post, Body, Patch, Param, Delete, ConflictException } from '@nestjs/common';
import { FormService } from './form.service';
import { CreateFormDto } from './dto/create-form.dto';
import { UpdateFormDto } from './dto/update-form.dto';

@Controller('form')
export class FormController {
    constructor(private readonly formService: FormService) {}

    @Post()
    async create(@Body() createFormDto: CreateFormDto) {
        const form = await this.findOne();
        if (form.data) {
            throw new ConflictException('Lead form already exists.');
        }
        return this.formService.create(createFormDto);
    }

    @Get()
    findOne() {
        return this.formService.findOne();
    }


    @Patch(':id')
    update(@Param('id') id: string, @Body() updateFormDto: UpdateFormDto) {
        return this.formService.update(+id, updateFormDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.formService.remove(+id);
    }
}
