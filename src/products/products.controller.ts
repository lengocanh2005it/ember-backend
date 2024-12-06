import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
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
  UseInterceptors,
} from '@nestjs/common';
import { ResponseMessage } from 'src/decorators/response-message.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RoleAuthGuard } from 'src/auth/guards/role.guard';
import { CreateProductDto } from 'src/products/dtos/create-product.dto';
import { UpdateProductDto } from 'src/products/dtos/update-product.dto';
import { Product } from 'src/products/entities/products.entity';
import { ProductsService } from 'src/products/products.service';
import { Roles } from 'src/roles/role.decorator';
import { Role } from 'src/roles/role.enum';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  @UseInterceptors(CacheInterceptor)
  @CacheKey('products')
  @CacheTTL(60)
  @ResponseMessage('Get products successfully!')
  async findAll(): Promise<Product[]> {
    return await this.productService.findAll();
  }

  @Get('/featured')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  @ResponseMessage('Get featured products successfully!')
  async findAllFeaturedProducts(): Promise<Product[]> {
    return await this.productService.findAllFeaturedProducts();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.USER)
  @ResponseMessage('Get product successfully!')
  async findOne(
    @Param('id') id: string,
    @Query() queries: Record<string, string>,
  ): Promise<Product> {
    return await this.productService.findOne(id, queries);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  async createOne(
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product[]> {
    return await this.productService.createOne(createProductDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  async updateOne(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product[]> {
    return await this.productService.updateOne(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  async deleteOne(@Param('id') id: string): Promise<Product[]> {
    return await this.productService.deleteOne(id);
  }

  @Delete('delete-reviews/:id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  async deleteReviewsOfProduct(
    @Param('id') id: string,
    @Query() queries: Record<string, string>,
  ): Promise<any> {
    return await this.productService.deleteReviewsOfProduct(id, queries);
  }
}
