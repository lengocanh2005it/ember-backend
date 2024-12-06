import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RoleAuthGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/roles/role.decorator';
import { Role } from 'src/roles/role.enum';
import { CreateEventDto } from 'src/events/dtos/create-event.dto';
import { UpdateEventDto } from 'src/events/dtos/update-event.dto';
import { EventsService } from 'src/events/events.service';
import { Event } from 'src/events/entities/events.entity';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async getEvents(): Promise<Event[]> {
    return await this.eventsService.getEvents();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  async getEvent(@Param('id') id: string): Promise<Event> {
    return await this.eventsService.getEvent(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  async createEvent(@Body() createEventDto: CreateEventDto): Promise<Event> {
    return await this.eventsService.createEvent(createEventDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  async updateEvent(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<Event[]> {
    return await this.eventsService.updateEvent(id, updateEventDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  async deleteEvent(@Param('id') id: string): Promise<Event[]> {
    return await this.eventsService.deleteEvent(id);
  }
}
