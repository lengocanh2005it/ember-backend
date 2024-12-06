import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PermissionsService } from 'src/permissions/permissions.service';
import { CreateRoleDto } from 'src/roles/dtos/create-role.dto';
import { Role } from 'src/roles/entities/roles.entity';
import { RolesService } from 'src/roles/roles.service';

@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly permissionsService: PermissionsService,
  ) {}

  @Get()
  async findAll(): Promise<Role[]> {
    return await this.rolesService.findAll();
  }

  @Post()
  async createOne(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return await this.rolesService.create(createRoleDto);
  }

  @Post(':id')
  async assignPermissionsToRole(
    @Param('id') id: string,
    @Body('permissions') permissions: string[],
  ): Promise<any> {
    const permissionEntities =
      await this.permissionsService.findAllByNames(permissions);
    return await this.rolesService.assignPermissions(id, permissionEntities);
  }
}
