import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePromotionDto } from 'src/promotions/dtos/create-promotion.dto';
import { UpdatePromotionDto } from 'src/promotions/dtos/update-promotion.dto';
import { Promotion } from 'src/promotions/entities/promotions.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PromotionsService implements OnModuleInit {
  constructor(
    @InjectRepository(Promotion)
    private readonly promotionRepository: Repository<Promotion>,
  ) {}

  async onModuleInit() {
    await this.updateExpirationPromotions();
  }

  async getPromotions(): Promise<Promotion[]> {
    return await this.promotionRepository.find();
  }

  async getPromotion(id: string): Promise<Promotion> {
    const promotion = await this.promotionRepository.findOneBy({ id });
    if (!promotion) throw new NotFoundException('Promotion Not Found.');
    return promotion;
  }

  async createPromotion(
    createPromotionDto: CreatePromotionDto,
  ): Promise<Promotion[]> {
    const promotion = this.promotionRepository.create(createPromotionDto);
    await this.promotionRepository.save(promotion);
    return await this.getPromotions();
  }

  async deletePromotion(id: string): Promise<Promotion[]> {
    const promotion = await this.promotionRepository.findOneBy({ id });
    if (!promotion) throw new NotFoundException('Promotion Not Found.');
    await this.promotionRepository.delete({ id });
    return await this.getPromotions();
  }

  async updatePromotion(
    id: string,
    updatePromotionDto: UpdatePromotionDto,
  ): Promise<Promotion[]> {
    const promotion = await this.promotionRepository.findOneBy({ id });
    if (!promotion) throw new NotFoundException('Promotion Not Found.');

    await this.promotionRepository.update({ id }, updatePromotionDto);

    return await this.getPromotions();
  }

  async updateExpirationPromotions() {
    const today = new Date();

    await this.promotionRepository
      .createQueryBuilder()
      .update(Promotion)
      .set({ status: 'inactive' })
      .where('end_date < :today', { today })
      .andWhere('status = :status', { status: 'active' })
      .execute();
  }
}
