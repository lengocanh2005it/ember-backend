import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Table } from 'src/tables/entities/tables.entity';
import { TablesService } from './tables.service';
import { TablesController } from './tables.controller';
import { AreasModule } from 'src/areas/areas.module';
import { AreasService } from 'src/areas/areas.service';
import { Area } from 'src/areas/entities/areas.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Table, Area]), AreasModule],
  providers: [TablesService, AreasService],
  controllers: [TablesController],
})
export class TablesModule {}
