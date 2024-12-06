import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateOrderDto } from 'src/orders/dtos/create-order.dto';
import { Product } from 'src/products/entities/products.entity';

export class OrderProductCreateDto {
  @ValidateNested()
  @Type(() => CreateOrderDto)
  order!: CreateOrderDto;

  @ValidateNested({ each: true })
  @Type(() => Product)
  products!: Product[];
}
