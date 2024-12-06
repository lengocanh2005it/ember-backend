import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCartDto } from 'src/carts/dtos/create-cart.dto';
import { UpdateCartDto } from 'src/carts/dtos/update-cart.dto';
import { Cart } from 'src/carts/entities/carts.entity';
import dataSource from 'src/database/data-source';
import { ProductsService } from 'src/products/products.service';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) {}

  async findAll(): Promise<Cart[]> {
    return await this.cartRepository
      .createQueryBuilder('cart')
      .leftJoinAndSelect('cart.user', 'user')
      .select(['cart', 'user.id', 'user.name', 'user.username'])
      .getMany();
  }

  async findOne(id: string): Promise<Cart> {
    return await this.cartRepository.findOneBy({ id });
  }

  async createOne(cartCreateDto: CreateCartDto): Promise<Cart[]> {
    const { userId, productId, quantity } = cartCreateDto;

    const product = await this.productsService.findOne(productId);

    const cart = await this.cartRepository.findOneBy({ product });

    if (cart) {
      await this.cartRepository.update(
        { id: cart.id },
        { quantity: cart.quantity + quantity },
      );

      return await this.findAll();
    }

    const newCart = this.cartRepository.create(cartCreateDto);

    const user = await this.usersService.findOne(userId);

    if (!user) throw new NotFoundException('User Not Found.');

    await this.cartRepository.save(newCart);

    await dataSource
      .createQueryBuilder()
      .relation(User, 'carts')
      .of(user.id)
      .add(newCart.id);

    return await this.findAll();
  }

  async updateOne(id: string, updateCartDto: UpdateCartDto): Promise<Cart> {
    const cart = await this.findOne(id);

    if (!cart) throw new BadRequestException('Cart Not Found.');

    await this.cartRepository.update({ id }, updateCartDto);

    return await this.findOne(id);
  }

  async deleteOne(id: string): Promise<void> {
    const cart = await this.cartRepository.findOneBy({ id });

    if (!cart) throw new NotFoundException('Cart Not Found.');

    await this.cartRepository.delete({ id });
  }
}
