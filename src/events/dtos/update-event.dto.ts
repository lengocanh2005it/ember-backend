import { Type } from 'class-transformer';
import {
  IsDate,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class UpdateEventDto {
  @IsString()
  @IsNotEmpty()
  readonly title!: string;

  @IsOptional()
  readonly description?: string;

  @IsNumber()
  @IsPositive()
  readonly guests_number!: number;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  readonly start_date!: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  readonly end_date!: Date;

  @IsString()
  @IsNotEmpty()
  readonly image!: string;

  @IsIn(['concert', 'food_festival', 'cooking_class', 'holiday_event'])
  @IsNotEmpty()
  readonly type!: string;

  @IsIn(['scheduled', 'ongoing', 'finished'])
  @IsNotEmpty()
  readonly status!: string;
}
