import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class UpdateOrderDto {
  @IsNumber()
  @IsPositive()
  readonly total_price!: number;

  @IsOptional()
  readonly delivery_address?: string;

  @IsIn(['home_delivery', 'pick_up'])
  @IsNotEmpty()
  readonly delivery_method!: string;

  @IsOptional()
  readonly note?: string;
}
