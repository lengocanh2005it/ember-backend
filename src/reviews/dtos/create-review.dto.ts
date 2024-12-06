import { Type } from 'class-transformer';
import {
  IsDate,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(5)
  readonly rating_number!: number;

  @IsString()
  @IsNotEmpty()
  readonly comment!: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['restaurant', 'order', 'reservation', 'product'])
  readonly type!: string;

  @IsOptional()
  readonly is_featured?: boolean;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  readonly date!: Date;

  @IsString()
  @IsNotEmpty()
  readonly userId!: string;

  @IsOptional()
  readonly productId?: string;

  @IsOptional()
  readonly orderIds?: string[];

  @IsOptional()
  readonly reservationIds?: string[];
}
