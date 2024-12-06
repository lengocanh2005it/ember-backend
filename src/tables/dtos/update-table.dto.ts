import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class UpdateTableDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsOptional()
  readonly note?: string;

  @IsNumber()
  @IsPositive()
  readonly capacity!: number;

  @IsNumber()
  @IsPositive()
  readonly floor_number: number;

  @IsString()
  @IsNotEmpty()
  readonly status!: string;

  @IsString()
  @IsNotEmpty()
  readonly operating_hours!: string;
}
