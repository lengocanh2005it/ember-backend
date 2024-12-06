import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Discount } from 'src/discounts/entities/discounts.entity';
import { UserDiscount } from 'src/user-discount/entities/user-discount.entity';
import { User } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserDiscountService {
  constructor(
    @InjectRepository(UserDiscount)
    private readonly userDiscountRepository: Repository<UserDiscount>,
  ) {}

  public addDiscountToUser = async (
    user: User,
    discount: Discount,
  ): Promise<void> => {
    const isExistedUserAndDiscount = await this.userDiscountRepository.findOne({
      where: {
        discount,
        user,
      },
    });

    if (isExistedUserAndDiscount) {
      await this.userDiscountRepository.update(
        {
          user,
          discount,
        },
        {
          quantity: isExistedUserAndDiscount.quantity + 1,
        },
      );
    } else {
      const newUserDiscount = this.userDiscountRepository.create({
        user,
        discount,
        quantity: 1,
        status: 'unused',
      });

      await this.userDiscountRepository.save(newUserDiscount);
    }
  };
}
