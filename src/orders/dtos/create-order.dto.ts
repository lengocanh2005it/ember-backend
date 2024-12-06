import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateOrderDto {
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

  @IsString()
  @IsNotEmpty()
  readonly userId!: string;
}
