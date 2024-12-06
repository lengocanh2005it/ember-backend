import { CacheInterceptor, CacheKey } from '@nestjs/cache-manager';
import {
  Body,
  ClassSerializerInterceptor,
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
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RoleAuthGuard } from 'src/auth/guards/role.guard';
import { Cart } from 'src/carts/entities/carts.entity';
import { ResponseMessage } from 'src/decorators/response-message.decorator';
import { Discount } from 'src/discounts/entities/discounts.entity';
import { Order } from 'src/orders/entities/orders.entity';
import { Reservation } from 'src/reservations/entities/reservations.entity';
import { Review } from 'src/reviews/entities/reviews.entity';
import { Roles } from 'src/roles/role.decorator';
import { Role } from 'src/roles/role.enum';
import { UserCreateDto } from 'src/users/dtos/create-user.dto';
import { UserUpdateDto } from 'src/users/dtos/update-user.dto';
import { User } from 'src/users/entities/users.entity';
import { UsersInterceptor } from 'src/users/users.interceptor';
import { UsersService } from 'src/users/users.service';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheKey('users')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage('Get users successfully!')
  @UseInterceptors(UsersInterceptor)
  async findAll(@Query() queries: Record<string, string>): Promise<User[]> {
    return await this.usersService.findAll(queries);
  }

  @Get('email/:email')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  @UseInterceptors(UsersInterceptor)
  async findOneByEmail(@Param('email') email: string): Promise<User> {
    return await this.usersService.findOneByEmail(email);
  }

  @Get('/cart/:id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  async getCarts(@Param('id') id: string): Promise<Cart[]> {
    return await this.usersService.findCartById(id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  @ResponseMessage('Get user successfully!')
  @UseInterceptors(UsersInterceptor)
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.usersService.findOne(id);
  }

  @Get('payments/:id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async getPayments(@Param('id') id: string) {
    return await this.usersService.getPayments(id);
  }

  @Post()
  @UseInterceptors(UsersInterceptor)
  @ResponseMessage('Create user successfully!')
  async create(@Body() userCreateDto: UserCreateDto): Promise<User> {
    return await this.usersService.create(userCreateDto);
  }

  @Get('order/:id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async getOrderByUserId(@Param('id') id: string): Promise<Order[]> {
    return await this.usersService.findOrderById(id);
  }

  @Get('discount/:id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async getDiscountByUserId(@Param('id') id: string): Promise<Discount[]> {
    return await this.usersService.findDiscountById(id);
  }

  @Get('reservation/:id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async getReservationByUserId(
    @Param('id') id: string,
    @Query() queries: Record<string, string>,
  ): Promise<Reservation[]> {
    return await this.usersService.findReservationById(id, queries);
  }

  @Get('reviews/:id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async getReviewByUserId(@Param('id') id: string): Promise<Review[]> {
    console.log('Inside Reviews getReviewByUserId!');
    return await this.usersService.findReviewById(id);
  }

  @Post('loyalty-point/:id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async handleRedeemPoint(@Param('id') id: string): Promise<void> {
    return await this.usersService.handleRedeemPoint(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  @ResponseMessage('Update user successfully!')
  @UseInterceptors(UsersInterceptor)
  async update(
    @Param('id') id: string,
    @Body() userUpdateDto: UserUpdateDto,
  ): Promise<User> {
    return await this.usersService.update(id, userUpdateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage('Delete user successfully!')
  @UseInterceptors(UsersInterceptor)
  async delete(@Param('id') id: string): Promise<User[]> {
    return await this.usersService.delete(id);
  }
}
