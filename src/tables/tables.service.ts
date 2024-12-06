import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AreasService } from 'src/areas/areas.service';
import { CreateTableDto } from 'src/tables/dtos/create-table.dto';
import { UpdateTableDto } from 'src/tables/dtos/update-table.dto';
import { Table } from 'src/tables/entities/tables.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(Table)
    private readonly tableRepository: Repository<Table>,
    private readonly areasService: AreasService,
  ) {}

  async findAll(): Promise<Table[]> {
    return await this.tableRepository.find();
  }

  async findOne(id: string): Promise<Table> {
    const table = await this.tableRepository.findOneBy({ id });
    if (!table) throw new NotFoundException('Table Not Found.');
    return table;
  }

  async createOne(createTableDto: CreateTableDto): Promise<Table> {
    const { areaId } = createTableDto;

    const table = this.tableRepository.create(createTableDto);

    await this.tableRepository.save(table);

    await this.areasService.addTableToArea(areaId, table.id);

    return table;
  }

  async updateOne(updateTableDto: UpdateTableDto, id: string): Promise<Table> {
    const table = await this.tableRepository.findOneBy({ id });
    if (!table) throw new NotFoundException('Table Not Found.');
    await this.tableRepository.update({ id }, updateTableDto);
    return await this.tableRepository.findOneBy({ id });
  }

  async deleteOne(id: string): Promise<Table[]> {
    const table = await this.tableRepository.findOneBy({ id });
    if (!table) throw new NotFoundException('Table Not Found.');
    return await this.tableRepository.find();
  }
}
