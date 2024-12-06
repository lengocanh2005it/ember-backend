import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateAreaDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsOptional()
  readonly description?: string;

  @IsNumber()
  @IsPositive()
  readonly capacity!: number;

  @IsNumber()
  @IsPositive()
  readonly floor_number!: number;

  @IsOptional()
  readonly status?: string;

  @IsString()
  @IsNotEmpty()
  readonly operating_hours!: string;
}
