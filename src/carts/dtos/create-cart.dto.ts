import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateCartDto {
  @IsNumber()
  @IsPositive()
  readonly quantity!: number;

  @IsOptional()
  readonly note?: string;

  @IsString()
  @IsNotEmpty()
  readonly productId!: string;

  @IsString()
  @IsNotEmpty()
  readonly userId!: string;
}
