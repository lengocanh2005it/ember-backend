import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsString()
  @IsNotEmpty()
  readonly description!: string;

  @IsNumber()
  @IsPositive()
  readonly price!: number;

  @IsNumber()
  @IsPositive()
  readonly stock!: number;

  @IsString()
  @IsNotEmpty()
  readonly image!: string;
}
