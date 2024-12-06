import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateTableDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsOptional()
  readonly note?: string;

  @IsNumber()
  @IsPositive()
  readonly capacity!: number;

  @IsOptional()
  readonly status?: string;

  @IsString()
  @IsNotEmpty()
  readonly areaId!: string;
}
