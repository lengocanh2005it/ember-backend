import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/carts/entities/carts.entity';
import dataSource from 'src/database/data-source';
import { DiscountsService } from 'src/discounts/discounts.service';
import { Discount } from 'src/discounts/entities/discounts.entity';
import { OrdersService } from 'src/orders/orders.service';
import { Payment } from 'src/payments/entities/payments.entity';
import { Reservation } from 'src/reservations/entities/reservations.entity';
import { ReservationsService } from 'src/reservations/reservations.service';
import { Review } from 'src/reviews/entities/reviews.entity';
import { RolesService } from 'src/roles/roles.service';
import { UserDiscountService } from 'src/user-discount/user-discount.service';
import { UserCreateDto } from 'src/users/dtos/create-user.dto';
import { UserUpdateDto } from 'src/users/dtos/update-user.dto';
import { User } from 'src/users/entities/users.entity';
import { encodePassword } from 'src/utils/bcrypt';
import { Like, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly ordersService: OrdersService,
    private readonly rolesService: RolesService,
    private readonly discountsService: DiscountsService,
    private readonly userDiscountService: UserDiscountService,
    private readonly reservationsService: ReservationsService,
  ) {}

  async findAll(queries?: Record<string, string>): Promise<User[]> {
    const filters: any = {};

    if (queries && Object.keys(queries).length > 0) {
      const { username, sort, page, limit } = queries;

      if (username) {
        filters.username = Like(`%${username}%`);
      }

      const limitValue = Number(limit) || 10;
      const pageValue = Number(page) || 1;
      const sortOrder = sort === 'desc' ? 'DESC' : 'ASC';

      const users = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.roles', 'roles')
        .where(filters)
        .orderBy('user.username', sortOrder)
        .skip((pageValue - 1) * limitValue)
        .take(limitValue)
        .getMany();

      return users.map((user) => ({
        ...user,
        roles: user.roles.map((role) => role.name),
      })) as any;
    }

    const users = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .getMany();

    return users.map((user) => ({
      ...user,
      roles: user.roles.map((role) => role.name),
    })) as any;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'roles')
      .where('user.id = :id', { id })
      .getOne();

    if (!user) throw new NotFoundException('User Not Found!');

    return {
      ...user,
      roles: user.roles.map((role) => role.name),
    } as any;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
      relations: ['roles'],
      select: {
        id: true,
        username: true,
        roles: {
          name: true,
        },
      },
    });

    if (!user) throw new NotFoundException('User Not Found!');

    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        username,
      },
      relations: ['roles'],
    });

    if (!user) throw new NotFoundException('User Not Found.');

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOneBy({ email });
  }

  async create(userCreateDto: UserCreateDto): Promise<User> {
    const { username, password } = userCreateDto;

    const isExistedUser = await this.userRepository.findOneBy({
      username,
    });

    const isHasAdmin = await this.userRepository.findOneBy({
      username: process.env.ADMIN_NAME!,
    });

    if (isExistedUser) throw new BadRequestException('Username has existed.');

    if (!isHasAdmin) {
      await this.generateAdmin({
        username: process.env.ADMIN_NAME!,
        password: process.env.ADMIN_PASSWORD!,
      });
    }

    const user = this.userRepository.create({
      username,
      password: encodePassword(password),
    });

    await this.userRepository.save(user);

    const role = await this.rolesService.findRoleByName('user');

    await this.userRepository
      .createQueryBuilder('user')
      .relation(User, 'roles')
      .of(user.id)
      .add(role.id);

    return user;
  }

  async update(id: string, userUpdateDto: UserUpdateDto): Promise<User> {
    const isExistedEmail = await this.userRepository.findOne({
      where: {
        email: userUpdateDto.email,
      },
    });

    if (isExistedEmail && id !== isExistedEmail.id)
      throw new BadRequestException('Email has existed!');

    await this.userRepository.update({ id }, userUpdateDto);

    return this.findOne(id);
  }

  async updateImage(id: string, imageUrl: string): Promise<void> {
    await this.userRepository.update(
      { id },
      {
        image: imageUrl,
      },
    );
  }

  async delete(id: string): Promise<User[]> {
    await this.userRepository.delete({ id });
    return await this.findAll();
  }

  async findCartById(id: string): Promise<Cart[]> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['carts'],
    });

    if (!user) throw new BadRequestException('User not found.');

    return user.carts;
  }

  async findDiscountById(id: string): Promise<Discount[]> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['discounts'],
    });

    if (!user) throw new BadRequestException('User not found.');

    return user.userDiscounts.map((userDiscount) => userDiscount.discount);
  }

  async findReservationById(
    id: string,
    queries?: Record<string, string>,
  ): Promise<Reservation[]> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['reservations'],
    });

    if (!user) throw new BadRequestException('User not found.');

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    let reservations = await this.reservationsService.getReservationsOfUser(
      id,
      startOfDay,
      endOfDay,
    );

    if (queries && queries.option === 'history') {
      reservations = await this.reservationsService.getReservationsOfUser(
        id,
        startOfDay,
      );
    }

    return reservations;
  }

  async findReviewById(id: string): Promise<Review[]> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['reviews'],
    });
    if (!user) throw new BadRequestException('User not found.');

    return user.reviews;
  }

  async findOrderById(id: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException('User Not Found.');

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const currentOrders = await this.ordersService.findOneByUserId(
      id,
      startOfDay,
      endOfDay,
    );

    const historyOrders = await this.ordersService.findOneByUserId(id);

    const ordersWithProducts = currentOrders.map((order) => {
      const products = order.order_details.map((product: any) => ({
        name: product.name,
        availability: product.availability ? 'true' : 'false',
        quantity: product.OrderProduct.quantity,
      }));

      return {
        ...order,
        products,
        reviews: order.reviews,
      };
    });

    const historyOrdersWithProducts = historyOrders.map((historyOrder) => {
      const products = historyOrder.order_details.map((product: any) => ({
        name: product.name,
        availability: product.availability ? 'true' : 'false',
        quantity: product.OrderProduct.quantity,
      }));

      return {
        ...historyOrder,
        products,
        reviews: historyOrder.reviews,
      };
    });

    return {
      currentOrders: ordersWithProducts,
      historyOrders: historyOrdersWithProducts,
    };
  }

  async updatePassword(email: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) throw new NotFoundException('User Not Found.');

    await this.userRepository.update(
      { email },
      {
        password: newPassword,
      },
    );
  }

  async handleRedeemPoint(id: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) throw new NotFoundException('User Not Found.');

    const { loyalty_points } = user;

    if (loyalty_points >= 500) {
      const discount = await this.discountsService.findOneByValue(10);

      await this.userDiscountService.addDiscountToUser(user, discount);
    } else {
      throw new BadRequestException("You don't have enough loyalty point!");
    }
  }

  private async generateAdmin(userCreateDto: UserCreateDto) {
    const { username, password } = userCreateDto;

    const user = this.userRepository.create({
      username,
      password: encodePassword(password),
    });

    await this.userRepository.save(user);

    const adminRole = await this.rolesService.findRoleByName('admin');
    const userRole = await this.rolesService.findRoleByName('user');

    await this.userRepository
      .createQueryBuilder('user')
      .relation(User, 'roles')
      .of(user.id)
      .add([adminRole.id, userRole.id]);
  }

  public async addReviewToUser(userId: string, review: Review): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) throw new BadRequestException('User Not Found.');

    await dataSource
      .createQueryBuilder()
      .relation(User, 'reviews')
      .of(userId)
      .add(review.id);
  }

  public getPayments = async (userId: string): Promise<Payment[]> => {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['payments'],
    });

    if (!user) throw new NotFoundException('User Not Found.');

    return user.payments;
  };

  public updateProfileUser = async (userId: string) => {
    const user = await this.userRepository.findOneBy({ id: userId });

    await this.userRepository.update(
      { id: userId },
      {
        total_orders: user.total_orders + 1,
        loyalty_points: user.loyalty_points + 10,
      },
    );
  };

  public findUserBySocialId = async (
    socialField: 'google_id' | 'facebook_id',
    socialId: string,
  ): Promise<User> => {
    const user = await this.userRepository.findOne({
      where: {
        [socialField]: socialId,
      },
      relations: ['roles'],
    });

    return user;
  };

  public createUserBySocialId = async (
    socialField: 'google_id' | 'facebook_id',
    socialId: string,
    name: string,
    email: string,
  ): Promise<User> => {
    const user = this.userRepository.create({
      [socialField]: socialId,
      name,
      email,
    });

    await this.userRepository.save(user);

    return await this.userRepository.findOne({
      where: {
        id: user.id,
      },
      relations: ['roles'],
    });
  };

  public updateThemeOfUser = async (
    id: string,
    theme: string,
  ): Promise<void> => {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('User Not Found.');
    await this.userRepository.update({ id }, { theme });
  };
}
