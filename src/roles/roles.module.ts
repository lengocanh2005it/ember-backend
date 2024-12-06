import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/roles/entities/roles.entity';
import { RolesService } from './roles.service';
import { RolesController } from 'src/roles/roles.controller';
import { Permission } from 'src/permissions/entities/permissions.entity';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { PermissionsService } from 'src/permissions/permissions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission]), PermissionsModule],
  providers: [RolesService, PermissionsService],
  controllers: [RolesController],
  exports: [RolesService],
})
export class RolesModule {}
