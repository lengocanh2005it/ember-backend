import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class UpdateCartDto {
  @IsNumber()
  @IsPositive()
  readonly quantity!: number;

  @IsOptional()
  readonly note?: string;

  @IsString()
  @IsNotEmpty()
  readonly productId!: string;
}
