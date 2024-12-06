import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAreaDto } from 'src/areas/dtos/create-area.dto';
import { UpdateAreaDto } from 'src/areas/dtos/update-area.dto';
import { Area } from 'src/areas/entities/areas.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AreasService {
  constructor(
    @InjectRepository(Area) private readonly areaRepository: Repository<Area>,
  ) {}

  async findAll(): Promise<Area[]> {
    return await this.areaRepository.find();
  }

  async findOne(id: string): Promise<Area> {
    const area = await this.areaRepository.findOneBy({ id });
    if (!area) throw new NotFoundException('Area Not Found.');
    return area;
  }

  async createOne(createAreaDto: CreateAreaDto): Promise<Area> {
    const area = this.areaRepository.create(createAreaDto);
    return await this.areaRepository.save(area);
  }

  async updateOne(updateAreaDto: UpdateAreaDto, id: string): Promise<Area> {
    const area = await this.areaRepository.findOneBy({ id });
    if (!area) throw new NotFoundException('Area Not Found.');
    await this.areaRepository.update({ id }, updateAreaDto);
    return await this.areaRepository.findOneBy({ id });
  }

  async deleteOne(id: string): Promise<Area[]> {
    const area = await this.areaRepository.findOneBy({ id });
    if (!area) throw new NotFoundException('Area Not Found.');
    return await this.areaRepository.find();
  }

  public addTableToArea = async (
    areaId: string,
    tableId: string,
  ): Promise<void> => {
    await this.areaRepository
      .createQueryBuilder('area')
      .relation(Area, 'tables')
      .of(areaId)
      .add(tableId);
  };
}
