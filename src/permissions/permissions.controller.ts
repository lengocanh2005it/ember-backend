import { Body, Controller, Post } from '@nestjs/common';
import { CreatePermissionDto } from 'src/permissions/dtos/create-permission.dto';
import { Permission } from 'src/permissions/entities/permissions.entity';
import { PermissionsService } from 'src/permissions/permissions.service';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  async create(
    @Body() createPermissionDto: CreatePermissionDto,
  ): Promise<Permission> {
    return await this.permissionsService.create(createPermissionDto);
  }
}
