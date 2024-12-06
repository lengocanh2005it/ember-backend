import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/permissions/entities/permissions.entity';
import { CreateRoleDto } from 'src/roles/dtos/create-role.dto';
import { Role } from 'src/roles/entities/roles.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  async findAllPermissionByRoleName(name: string) {
    const rolesWithPermissions = await this.roleRepository.findOne({
      where: {
        name,
      },
      relations: ['permissions'],
      select: {
        id: true,
        name: true,
        permissions: {
          name: true,
        },
      },
    });

    return rolesWithPermissions;
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const newRole = this.roleRepository.create(createRoleDto);
    return await this.roleRepository.save(newRole);
  }

  async findRoleByName(name: string): Promise<Role> {
    return await this.roleRepository.findOneBy({ name });
  }

  async addPermissionToRole(role: Role, permission: Permission): Promise<void> {
    await this.roleRepository
      .createQueryBuilder('role')
      .relation(Role, 'permissions')
      .of(role.id)
      .add(permission.id);
  }

  async assignPermissions(
    roleId: string,
    permissions: Permission[],
  ): Promise<Role[]> {
    for (const permission of permissions) {
      await this.roleRepository
        .createQueryBuilder('role')
        .relation(Role, 'permissions')
        .of(roleId)
        .add(permission.id);
    }

    return await this.roleRepository.find({
      relations: ['permissions'],
    });
  }
}
