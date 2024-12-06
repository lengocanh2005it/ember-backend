import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dataSource from 'src/database/data-source';
import { Order } from 'src/orders/entities/orders.entity';
import { Product } from 'src/products/entities/products.entity';
import { Reservation } from 'src/reservations/entities/reservations.entity';
import { CreateReviewDto } from 'src/reviews/dtos/create-review.dto';
import { Review } from 'src/reviews/entities/reviews.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  private async getAllReviews(featured?: string): Promise<Review[]> {
    let reviews = await this.reviewRepository.find({
      relations: ['user'],
    });
    if (featured && featured === 'true') {
      reviews = await this.reviewRepository.find({
        where: {
          is_featured: true,
        },
        relations: ['user'],
      });

      return reviews;
    }

    return reviews;
  }

  public async getReviewById(id: string) {
    const review = await this.reviewRepository.findOne({
      where: {
        id,
      },
      relations: ['user'],
    });

    if (!review) throw new NotFoundException('Review Not Found.');

    return review;
  }

  public async createReview(
    createReviewDto: CreateReviewDto,
    orders?: Order[],
    reservations?: Reservation[],
  ): Promise<Review> {
    const review = this.reviewRepository.create(createReviewDto);

    if (orders) {
      for (const order of orders) {
        await dataSource
          .createQueryBuilder()
          .relation(Order, 'reviews')
          .of(order.id)
          .add(review.id);
      }
    }

    if (reservations) {
      for (const reservation of reservations) {
        await dataSource
          .createQueryBuilder()
          .relation(Reservation, 'reviews')
          .of(reservation.id)
          .add(review.id);
      }
    }

    return await this.reviewRepository.save(review);
  }

  public async deleteReview(id: string): Promise<any> {
    const review = await this.reviewRepository.findOneBy({ id });
    if (!review) throw new NotFoundException('Review Not Found.');

    await this.reviewRepository.delete({ id });
  }

  public async handleCustomReviews(
    featured?: string,
  ): Promise<Array<Record<string, string | number>>> {
    const reviews = await this.getAllReviews(featured);
    return await Promise.all(
      reviews.map(async (review) => {
        const { rating_number, comment, date, user } = review;

        return {
          id: review.id,
          customerName: user.name ? user.name : user.username,
          image: user.image,
          rating_number,
          comment,
          date: date.toISOString(),
        };
      }),
    );
  }

  public async handleUpdateReviews(reviews: Review[]): Promise<Review[]> {
    if (!reviews.length) throw new BadRequestException('Empty reviews.');

    for (const item of reviews) {
      const review = await this.reviewRepository.findOneBy({ id: item.id });
      if (!review) throw new NotFoundException('Review Not Found.');

      await this.reviewRepository.update(
        { id: item.id },
        {
          is_featured: true,
        },
      );
    }

    return this.getAllReviews();
  }

  public async findProduct(product: Product): Promise<any> {
    const products = await this.reviewRepository.findBy({ product });

    if (!products.length) return;

    return {
      totalCount: products.length,
      totalRatingNumbers: products.reduce((acc, curr) => {
        return acc + curr.rating_number;
      }, 0),
    };
  }
}
