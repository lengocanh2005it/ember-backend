import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { DiscountEnum } from 'src/discounts/discount.enum';
import { generateRandomValue } from 'src/utils/utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Discount } from 'src/discounts/entities/discounts.entity';
import { LessThan, Repository } from 'typeorm';
import { UpdateDiscountDto } from 'src/discounts/dtos/update-discount.dto';
import { CreateDiscountDto } from 'src/discounts/dtos/create-discount.dto';

@Injectable()
export class DiscountsService implements OnModuleInit {
  constructor(
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
  ) {}

  onModuleInit() {
    this.updateExpirationDiscounts();
  }

  async findAll(): Promise<Discount[]> {
    return await this.discountRepository.find();
  }

  async findOne(id: string): Promise<Discount> {
    const discount = await this.discountRepository.findOneBy({ id });
    if (!discount) throw new NotFoundException('Discount Not Found.');
    return discount;
  }

  async findOneByValue(value: number): Promise<Discount> {
    const discount = await this.discountRepository.findOneBy({ value });
    if (!discount) throw new NotFoundException('Discount Not Found.');
    return discount;
  }

  async createOne(createDiscountDto: CreateDiscountDto): Promise<Discount[]> {
    const discount = this.discountRepository.create(createDiscountDto);
    await this.discountRepository.save(discount);
    return await this.findAll();
  }

  async updateOne(
    id: string,
    updateDiscountDto: UpdateDiscountDto,
  ): Promise<Discount[]> {
    const discount = await this.discountRepository.findOneBy({ id });
    if (!discount) throw new NotFoundException('Discount Not Found.');
    await this.discountRepository.update({ id }, updateDiscountDto);
    return await this.findAll();
  }

  async deleteOne(id: string): Promise<Discount[]> {
    await this.discountRepository.delete({ id });
    return await this.findAll();
  }

  async updateExpirationDiscounts() {
    const today = new Date();

    await this.discountRepository.update(
      { is_active: true, end_date: LessThan(today) },
      { is_active: false },
    );
  }

  createRandomDiscount = async (): Promise<Discount> => {
    const type =
      Math.random() > 0.5 ? DiscountEnum.PERCENTAGE : DiscountEnum.FIXED_AMOUNT;

    let value: number;

    if (type === DiscountEnum.PERCENTAGE) {
      // 10% -> 50%
      value = generateRandomValue(10, 50);
    } else {
      // 10 USD -> 50 USD
      value = generateRandomValue(10, 50);
    }

    const discount = await this.discountRepository.findOne({
      where: {
        currency: 'usd',
        type,
        value,
      },
    });

    if (!discount) {
      const newDiscount = this.discountRepository.create({
        type,
        value,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(new Date().setDate(new Date().getDate() + 7))
          .toISOString()
          .split('T')[0],
        is_active: true,
        currency: 'usd',
      });

      return await this.discountRepository.save(newDiscount);
    }

    return discount;
  };

  findDiscountByValue = async (value: number): Promise<Discount> => {
    const discount = await this.discountRepository.findOneBy({ value });
    if (!discount) throw new NotFoundException('Discount Not Found.');
    return discount;
  };
}
