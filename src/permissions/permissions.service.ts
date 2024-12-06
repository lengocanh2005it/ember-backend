import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePermissionDto } from 'src/permissions/dtos/create-permission.dto';
import { Permission } from 'src/permissions/entities/permissions.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async findOneByName(name: string): Promise<Permission> {
    const permission = await this.permissionRepository.findOneBy({ name });
    if (!permission) throw new NotFoundException('Permission Not Found.');
    return permission;
  }

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const { name } = createPermissionDto;

    const isExistPermission = await this.permissionRepository.findOneBy({
      name,
    });

    if (isExistPermission) return isExistPermission;

    const permission = this.permissionRepository.create(createPermissionDto);

    return await this.permissionRepository.save(permission);
  }

  async findAllByNames(permissionNames: string[]): Promise<Permission[]> {
    return await this.permissionRepository.find({
      where: {
        name: In(permissionNames),
      },
    });
  }
}
