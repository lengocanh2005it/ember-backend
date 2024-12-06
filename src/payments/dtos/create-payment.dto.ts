import { Type } from 'class-transformer';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

class DiscountDto {
  @IsString()
  @IsNotEmpty()
  readonly type!: string;

  @IsNumber()
  @IsPositive()
  readonly value!: number;
}

export class CreatePaymentDto {
  @IsNumber()
  @IsPositive()
  readonly amount!: number;

  @IsString()
  @IsNotEmpty()
  readonly source!: string;

  @IsOptional()
  readonly payment_intent_id?: string;

  @IsOptional()
  readonly payment_method_id?: string;

  @IsNotEmpty()
  @IsIn(['cash', 'card'])
  readonly payment_method!: string;

  @IsNotEmpty()
  @IsIn(['order', 'reservation'])
  readonly type!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => DiscountDto)
  readonly discount?: DiscountDto;

  @IsString()
  @IsNotEmpty()
  readonly userId!: string;

  @IsOptional()
  readonly orderId?: string;

  @IsOptional()
  readonly reservationId?: string;
}
