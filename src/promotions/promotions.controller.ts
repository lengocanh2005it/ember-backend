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
import { CreatePromotionDto } from 'src/promotions/dtos/create-promotion.dto';
import { UpdatePromotionDto } from 'src/promotions/dtos/update-promotion.dto';
import { Promotion } from 'src/promotions/entities/promotions.entity';
import { PromotionsService } from 'src/promotions/promotions.service';
import { Roles } from 'src/roles/role.decorator';
import { Role } from 'src/roles/role.enum';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async getPromotions(): Promise<Promotion[]> {
    return await this.promotionsService.getPromotions();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  async getPromotion(@Param('id') id: string): Promise<Promotion> {
    return await this.promotionsService.getPromotion(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  async createPromotion(
    @Body() createPromotionDto: CreatePromotionDto,
  ): Promise<Promotion[]> {
    return await this.promotionsService.createPromotion(createPromotionDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  async updatePromotion(
    @Param('id') id: string,
    @Body() updatePromotionDto: UpdatePromotionDto,
  ): Promise<Promotion[]> {
    return await this.promotionsService.updatePromotion(id, updatePromotionDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  async deletePromotion(@Param('id') id: string): Promise<Promotion[]> {
    return await this.promotionsService.deletePromotion(id);
  }
}
