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
import { ResponseMessage } from 'src/decorators/response-message.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { RoleAuthGuard } from 'src/auth/guards/role.guard';
import { CreateOrderDto } from 'src/orders/dtos/create-order.dto';
import { UpdateOrderDto } from 'src/orders/dtos/update-order.dto';
import { Order } from 'src/orders/entities/orders.entity';
import { OrdersService } from 'src/orders/orders.service';
import { Roles } from 'src/roles/role.decorator';
import { Role } from 'src/roles/role.enum';

@Controller('orders')
@UseInterceptors(ClassSerializerInterceptor)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  @ResponseMessage('Get orders successfully!')
  async findAll(): Promise<Order[]> {
    return await this.ordersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN)
  @ResponseMessage('Get order successfully!')
  async findOne(@Param('id') id: string): Promise<Order> {
    return await this.ordersService.findOne(id);
  }

  @Post()
  async createOne(
    @Body() createOrderDto: CreateOrderDto,
    @Query() queries: Record<string, string>,
  ): Promise<any> {
    await this.ordersService.createOne(createOrderDto);
    console.log(queries);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER)
  async deleteOne(
    @Param('id') id: string,
    @Query('delete') deleteOption: string,
  ): Promise<void> {
    const forceDelete: boolean = deleteOption === 'hard';
    return await this.ordersService.deleteOne(id, forceDelete);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleAuthGuard)
  @Roles(Role.ADMIN, Role.USER, Role.MANAGER)
  async updateOrder(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<any> {
    return await this.ordersService.updateOne(id, updateOrderDto);
  }
}
