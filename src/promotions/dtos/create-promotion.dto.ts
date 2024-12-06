import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePromotionDto {
  @IsString()
  @IsNotEmpty()
  readonly title!: string;

  @IsString()
  @IsNotEmpty()
  readonly description!: string;

  @IsString()
  @IsNotEmpty()
  readonly code!: string;

  @IsString()
  @IsNotEmpty()
  readonly startDate!: string;

  @IsString()
  @IsNotEmpty()
  readonly dueDate!: string;

  @IsString()
  @IsNotEmpty()
  readonly imageUrl!: string;

  @IsOptional()
  readonly note?: string;
}
