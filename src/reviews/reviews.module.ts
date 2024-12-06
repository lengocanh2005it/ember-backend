import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from 'src/reviews/entities/reviews.entity';
import { ReviewsController } from 'src/reviews/reviews.controller';
import { ReviewsService } from 'src/reviews/reviews.service';

@Module({
  imports: [TypeOrmModule.forFeature([Review])],
  providers: [ReviewsService],
  controllers: [ReviewsController],
  exports: [ReviewsService],
})
export class ReviewsModule {}
