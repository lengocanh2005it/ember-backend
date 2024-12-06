import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dataSource from 'src/database/data-source';
import { CreateProductDto } from 'src/products/dtos/create-product.dto';
import { UpdateProductDto } from 'src/products/dtos/update-product.dto';
import { Product } from 'src/products/entities/products.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findAllFeaturedProducts(): Promise<Product[]> {
    return await this.productRepository.find({
      where: {
        is_featured: true,
      },
    });
  }

  async findOne(
    id: string,
    queries?: Record<string, string>,
  ): Promise<Product> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .where('id = :id', { id });

    if (!(await query.getOne()))
      throw new NotFoundException('Product Not Found.');

    if (query && queries.option === 'reviews') {
      query
        .leftJoinAndSelect('product.reviews', 'reviews')
        .leftJoinAndSelect('reviews.user', 'user')
        .select([
          'product.id, product.name, product.image, reviews.comment, reviews.date, reviews.id',
          'user.name',
          'user.image',
          'user.username',
        ]);
    }

    return await query.getOne();
  }

  async createOne(createProductDto: CreateProductDto): Promise<Product[]> {
    const product = await this.productRepository.findOne({
      where: {
        name: createProductDto.name,
      },
    });

    if (product) throw new BadRequestException('Product has been existed.');

    const newProduct = this.productRepository.create(createProductDto);

    await this.productRepository.save(newProduct);

    return await this.findAll();
  }

  async updateOne(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product[]> {
    await this.productRepository.update({ id }, updateProductDto);

    return await this.findAll();
  }

  async deleteOne(id: string): Promise<Product[]> {
    await this.productRepository.delete({ id });

    return await this.findAll();
  }

  async deleteReviewsOfProduct(
    id: string,
    queries: Record<string, string>,
  ): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) throw new NotFoundException('Product Not Found.');

    const { reviewId } = queries;

    if (queries && reviewId) {
      await dataSource
        .createQueryBuilder()
        .relation(Product, 'reviews')
        .of(id)
        .remove(reviewId);
    }

    return await this.findOne(id, queries);
  }

  public async updateProduct(
    productId: string,
    totalRatingNumbers: number,
    totalCount: number,
  ): Promise<void> {
    const product = await this.productRepository.findOneBy({ id: productId });

    if (!product) throw new BadRequestException('Product not found.');

    await this.productRepository.update(
      { id: productId },
      {
        rating_count: totalCount,
        average_rating: parseFloat(
          (totalRatingNumbers / totalCount).toFixed(2),
        ),
      },
    );
  }
}
