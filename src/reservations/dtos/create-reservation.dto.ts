import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateReservationDto {
  @IsDate()
  @IsNotEmpty()
  readonly date_time!: Date;

  @IsNumber()
  @IsPositive()
  readonly guests_count!: number;

  @IsOptional()
  readonly note?: string;

  @IsString()
  @IsNotEmpty()
  readonly userId!: string;
}
