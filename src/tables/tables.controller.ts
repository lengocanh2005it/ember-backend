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
import { CreateTableDto } from 'src/tables/dtos/create-table.dto';
import { UpdateTableDto } from 'src/tables/dtos/update-table.dto';
import { Table } from 'src/tables/entities/tables.entity';
import { TablesService } from 'src/tables/tables.service';

@Controller('tables')
@UseInterceptors(ClassSerializerInterceptor)
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Get()
  async findAll(): Promise<Table[]> {
    return await this.tablesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Table> {
    return await this.tablesService.findOne(id);
  }

  @Post()
  async createOne(@Body() createTableDto: CreateTableDto): Promise<Table> {
    return await this.tablesService.createOne(createTableDto);
  }

  @Patch(':id')
  async updateOne(
    @Param('id') id: string,
    @Body() updateTableDto: UpdateTableDto,
  ): Promise<Table> {
    return await this.tablesService.updateOne(updateTableDto, id);
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string): Promise<Table[]> {
    return await this.tablesService.deleteOne(id);
  }
}
