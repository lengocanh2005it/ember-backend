import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dataSource from 'src/database/data-source';
import { CreateReservationDto } from 'src/reservations/dtos/create-reservation.dto';
import { UpdateReservationDto } from 'src/reservations/dtos/update-reservation.dto';
import { Reservation } from 'src/reservations/entities/reservations.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async findAll(queries: Record<string, string>): Promise<Reservation[]> {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const query = this.reservationRepository.createQueryBuilder('reservation');

    if (queries && queries.option !== 'history') {
      query.where(
        'reservation.createdAt BETWEEN :startOfToday AND :endOfToday',
        {
          startOfToday,
          endOfToday,
        },
      );
    } else {
      query.where('reservation.createdAt < :startOfToday', { startOfToday });
    }

    return await query.getMany();
  }

  async findOne(id: string): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOneBy({ id });
    if (!reservation) throw new NotFoundException('Reservation Not Found.');
    return reservation;
  }

  async createOne(
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    const { userId } = createReservationDto;

    const reservation = this.reservationRepository.create(createReservationDto);

    await dataSource
      .createQueryBuilder()
      .relation(Reservation, 'user')
      .of(reservation.id)
      .add(userId);

    return await this.reservationRepository.save(reservation);
  }

  async deleteOne(id: string): Promise<void> {
    const reservation = await this.reservationRepository.findOneBy({ id });
    if (!reservation) throw new NotFoundException('Reservation Not Found.');
    await this.reservationRepository.delete({ id });
  }

  async updateOne(
    id: string,
    reservationUpdateDto: UpdateReservationDto,
  ): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOneBy({ id });

    if (!reservation) throw new BadRequestException('Reservation Not Found.');

    await this.reservationRepository.update({ id }, reservationUpdateDto);

    return reservation;
  }

  public handleCheckTotalPriceOfReservation = async (
    reservationPrice: number,
    userId: string,
  ): Promise<void> => {
    console.log(userId);

    if (reservationPrice <= 20) return;
  };

  public async transformReservationIds(
    reservationIds: string[],
  ): Promise<Reservation[]> {
    const reservations = [];
    for (const reservationId of reservationIds) {
      const reservation = await this.reservationRepository.findOneBy({
        id: reservationId,
      });
      if (!reservation) throw new NotFoundException('Reservation not found.');

      reservations.push(reservation);
    }

    return reservations;
  }

  public getReservationsOfUser = async (
    userId: string,
    startOfDay: Date,
    endOfDay?: Date,
  ): Promise<Reservation[]> => {
    const query = this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.reviews', 'review')
      .leftJoinAndSelect('reservation.user', 'user')
      .where('user.id = :userId', { userId });

    if (endOfDay) {
      query.andWhere(
        'reservation.createdAt BETWEEN :startOfDay AND :endOfDay',
        {
          startOfDay,
          endOfDay,
        },
      );
    } else {
      query.andWhere('reservation.createdAt < :startOfDay', { startOfDay });
    }

    query.select([
      'reservation.id',
      'reservation.createdAt',
      'review.id',
      'review.comment',
      'review.createdAt',
    ]);

    return await query.getMany();
  };
}
