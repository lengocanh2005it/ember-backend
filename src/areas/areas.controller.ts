import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AreasService } from 'src/areas/areas.service';
import { CreateAreaDto } from 'src/areas/dtos/create-area.dto';
import { UpdateAreaDto } from 'src/areas/dtos/update-area.dto';
import { Area } from 'src/areas/entities/areas.entity';

@Controller('areas')
@UseInterceptors(ClassSerializerInterceptor)
export class AreasController {
  constructor(private readonly areasService: AreasService) {}

  @Get()
  async findAll(): Promise<Area[]> {
    return await this.areasService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Area> {
    return await this.areasService.findOne(id);
  }

  @Post()
  async createOne(@Body() createAreaDto: CreateAreaDto): Promise<Area> {
    return await this.areasService.createOne(createAreaDto);
  }

  @Patch(':id')
  async updateOne(
    @Param('id') id: string,
    @Body() updateAreaDto: UpdateAreaDto,
  ): Promise<Area> {
    return await this.areasService.updateOne(updateAreaDto, id);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<Area[]> {
    return await this.areasService.deleteOne(id);
  }
}
