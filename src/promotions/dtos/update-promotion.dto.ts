import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePromotionDto {
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

  @IsOptional()
  readonly note?: string;
}
