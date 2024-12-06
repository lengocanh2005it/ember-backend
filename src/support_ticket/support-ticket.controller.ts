import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RoleAuthGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/roles/role.decorator';
import { Role } from 'src/roles/role.enum';
import { CreateSupportTicketDto } from 'src/support_ticket/dtos/create-support-ticket.dto';
import { UpdateSupportTicketRequestDto } from 'src/support_ticket/dtos/update-st-request.dto';
import { UpdateSupportTicketDto } from 'src/support_ticket/dtos/update-support-ticket.dto';
import { SupportTicket } from 'src/support_ticket/entities/support-ticket.entity';
import { SupportTicketService } from 'src/support_ticket/support-ticket.service';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';

@Controller('support-ticket')
export class SupportTicketController {
  constructor(
    private readonly supportTicketService: SupportTicketService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async getAll(): Promise<any> {
    return await this.supportTicketService.getAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  async getOne(@Param('id') id: string): Promise<SupportTicket> {
    return await this.supportTicketService.getOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async createOne(
    @Body() createSupportTicketDto: CreateSupportTicketDto,
  ): Promise<User> {
    await this.supportTicketService.createOne(createSupportTicketDto);
    return await this.usersService.findOne(createSupportTicketDto.userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async updateOne(
    @Body() updateSupportRequestDto: UpdateSupportTicketRequestDto,
    @Param('id') id: string,
  ): Promise<User> {
    const { userId } = updateSupportRequestDto;
    await this.supportTicketService.updateOne(updateSupportRequestDto, id);
    return await this.usersService.findOne(userId);
  }

  @Patch('response/:id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  async updateResponseForRequest(
    @Param('id') id: string,
    @Body() updateSupportTicketDto: UpdateSupportTicketDto,
  ): Promise<any> {
    await this.supportTicketService.updateResponseForRequest(
      updateSupportTicketDto,
      id,
    );

    return await this.supportTicketService.getAll();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async deleteOne(
    @Param('id') id: string,
    @Query() queries: Record<string, string>,
  ): Promise<User> {
    const { userId } = queries;
    await this.supportTicketService.deleteOne(id, queries);
    return await this.usersService.findOne(userId);
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  async deleteOneByAdmin(@Param('id') id: string): Promise<any> {
    await this.supportTicketService.deleteOneByAdmin(id);
    return await this.supportTicketService.getAll();
  }
}
