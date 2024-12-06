import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from 'src/orders/dtos/create-order.dto';
import { UpdateOrderDto } from 'src/orders/dtos/update-order.dto';
import { Order } from 'src/orders/entities/orders.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService {
  private paymentThresholds = [50, 100, 200];

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find();
  }

  async findOneByUserId(
    userId: string,
    startOfDay?: Date,
    endOfDay?: Date,
  ): Promise<Order[]> {
    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderProducts', 'orderProduct')
      .leftJoinAndSelect('orderProduct.product', 'product')
      .leftJoinAndSelect('order.reviews', 'review')
      .where('order.userId = :id', { id: userId })
      .select([
        'order.id',
        'order.createdAt',
        'orderProduct.quantity',
        'product.id',
        'product.name',
        'product.availability',
        'review.comment',
        'review.id',
        'review.date',
      ]);

    if (startOfDay && endOfDay) {
      query.andWhere('order.createdAt BETWEEN :startOfDay AND :endOfDay', {
        startOfDay,
        endOfDay,
      });
    }

    return await query.getMany();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.reviews', 'reviews')
      .select(['order', 'reviews.comment', 'reviews.id', 'reviews.date'])
      .where('order.id = :id', { id })
      .getOne();

    if (!order) throw new BadRequestException('Order Not Found.');

    return order;
  }

  async createOne(orderCreateDto: CreateOrderDto): Promise<Order[]> {
    const order = this.orderRepository.create(orderCreateDto);

    await this.orderRepository.save(order);

    return this.findAll();
  }

  async updateOne(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);

    if (!order) throw new NotFoundException('Order Not Found.');

    await this.orderRepository.update({ id }, updateOrderDto);

    return await this.findOne(id);
  }

  async deleteOne(id: string, forceDelete: boolean): Promise<void> {
    if (forceDelete) {
      await this.orderRepository.delete({ id });
    } else {
      await this.orderRepository.softDelete({ id });
    }
  }

  public handleCheckTotalPriceOfOrder = async (
    totalPrice: number,
    userId: string,
  ): Promise<void> => {
    console.log(userId);
    if (!this.isEligibleForVoucher(totalPrice)) return;
  };

  public async transformOrderIds(orderIds: string[]): Promise<Order[]> {
    const orders: Order[] = [];

    for (const orderId of orderIds) {
      const order = await this.orderRepository.findOneBy({ id: orderId });

      if (!order) throw new BadRequestException('Order not found.');

      orders.push(order);
    }

    return orders;
  }

  private isEligibleForVoucher(totalPrice: number): boolean {
    return this.paymentThresholds.some((threshold) => totalPrice >= threshold);
  }
}
