import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSupportTicketDto } from 'src/support_ticket/dtos/create-support-ticket.dto';
import { UpdateSupportTicketRequestDto } from 'src/support_ticket/dtos/update-st-request.dto';
import { UpdateSupportTicketDto } from 'src/support_ticket/dtos/update-support-ticket.dto';
import { SupportTicket } from 'src/support_ticket/entities/support-ticket.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SupportTicketService {
  constructor(
    @InjectRepository(SupportTicket)
    private readonly supportTicketRepository: Repository<SupportTicket>,
  ) {}

  async getAll(): Promise<any> {
    const supportTickets = await this.supportTicketRepository.find({
      relations: ['user'],
    });

    return supportTickets.map((supportTicket: SupportTicket) => {
      const { id, request, status, response, createdAt } = supportTicket;
      const { username, name, email, image, id: userId } = supportTicket.user;

      const user: Record<string, string> = {
        username,
        name,
        email,
        avatar: image,
        userId,
      };

      return {
        requestId: id,
        date: (createdAt as Date).toISOString().split('T')[0],
        request,
        status,
        response,
        user,
      };
    });
  }

  async getOne(id: string): Promise<SupportTicket> {
    const supportTicket = await this.supportTicketRepository.findOneBy({ id });

    if (!supportTicket)
      throw new NotFoundException('Support Ticket not found.');

    return supportTicket;
  }

  async createOne(
    createSupportTicketDto: CreateSupportTicketDto,
  ): Promise<void> {
    await this.supportTicketRepository.create(createSupportTicketDto);
  }

  async updateOne(
    updateSupportTicketRequestDto: UpdateSupportTicketRequestDto,
    id: string,
  ): Promise<void> {
    const supportTicker = await this.supportTicketRepository.findOneBy({ id });
    if (!supportTicker)
      throw new NotFoundException('Support Ticker not found.');

    await this.supportTicketRepository.update(
      { id },
      updateSupportTicketRequestDto,
    );
  }

  public async updateResponseForRequest(
    updateSupportTicketDto: UpdateSupportTicketDto,
    id: string,
  ): Promise<void> {
    const supportTicket = await this.supportTicketRepository.findOneBy({ id });
    if (!supportTicket)
      throw new NotFoundException('Support Ticket not found.');

    await this.supportTicketRepository.update({ id }, updateSupportTicketDto);
  }

  public async deleteOne(
    id: string,
    queries?: Record<string, string>,
  ): Promise<void> {
    if (queries && queries.userId) {
      const supportTicket = await this.supportTicketRepository.findOneBy({
        id,
      });

      if (!supportTicket)
        throw new NotFoundException('Support Ticket not found.');

      await this.supportTicketRepository.delete({ id });
    } else {
      throw new Error('Internal Server Error!');
    }
  }

  public async deleteOneByAdmin(id: string): Promise<void> {
    const supportTicket = await this.supportTicketRepository.findOneBy({ id });
    if (!supportTicket)
      throw new NotFoundException('Support Ticket not found.');
    await this.supportTicketRepository.delete({ id });
  }
}
