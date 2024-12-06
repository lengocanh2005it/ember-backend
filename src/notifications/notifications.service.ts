import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNotificationDto } from 'src/notifications/dtos/create-notification.dto';
import { UpdateNotificationDto } from 'src/notifications/dtos/update-notification.dto';
import { Notification } from 'src/notifications/entities/notifications.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async findAll(): Promise<Notification[]> {
    return await this.notificationRepository.find();
  }

  async findOne(id: string): Promise<Notification> {
    return await this.notificationRepository.findOneBy({ id });
  }

  async createOne(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create(
      createNotificationDto,
    );
    return await this.notificationRepository.save(notification);
  }

  async updateOne(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Notification[]> {
    const notification = await this.notificationRepository.findOneBy({ id });
    if (!notification) throw new NotFoundException('Notification Not Found.');

    await this.notificationRepository.update({ id }, updateNotificationDto);

    return await this.findAll();
  }

  async deleteOne(id: string): Promise<Notification[]> {
    const notification = await this.notificationRepository.findOneBy({ id });
    if (!notification) throw new BadRequestException('Notification not found.');
    await this.notificationRepository.delete({ id });
    return await this.findAll();
  }
}
