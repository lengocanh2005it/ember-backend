import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsOptional,
  IsDate,
  IsBoolean,
  IsIn,
} from 'class-validator';

export class UpdateDiscountDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['percentage', 'fixed'])
  readonly type!: string;

  @IsNumber()
  @IsPositive()
  readonly value!: number;

  @IsOptional()
  readonly description?: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  readonly start_date!: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  readonly end_date!: Date;

  @IsBoolean()
  @IsNotEmpty()
  readonly is_active!: boolean;

  @IsString()
  @IsNotEmpty()
  readonly currency!: string;
}
