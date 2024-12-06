import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDiscount } from 'src/user-discount/entities/user-discount.entity';
import { UserDiscountService } from 'src/user-discount/user-discount.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserDiscount])],
  providers: [UserDiscountService],
  exports: [UserDiscountService],
})
export class UserDiscountModule {}
