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
import { DiscountsService } from 'src/discounts/discounts.service';
import { CreateDiscountDto } from 'src/discounts/dtos/create-discount.dto';
import { UpdateDiscountDto } from 'src/discounts/dtos/update-discount.dto';
import { Discount } from 'src/discounts/entities/discounts.entity';
import { Roles } from 'src/roles/role.decorator';
import { Role } from 'src/roles/role.enum';

@Controller('discounts')
export class DiscountsController {
  constructor(private readonly discountService: DiscountsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  async findAll(): Promise<Discount[]> {
    return await this.discountService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  async createOne(
    @Body()
    createDiscountDto: CreateDiscountDto,
  ): Promise<Discount[]> {
    return await this.discountService.createOne(createDiscountDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  async updateOne(
    @Param('id') id: string,
    @Body() updateDiscountDto: UpdateDiscountDto,
  ): Promise<Discount[]> {
    return await this.discountService.updateOne(id, updateDiscountDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  async deleteOne(@Param('id') id: string): Promise<Discount[]> {
    return await this.discountService.deleteOne(id);
  }
}
