import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateReviewDto {
  @IsBoolean()
  @IsNotEmpty()
  readonly isFeatured!: boolean;
}
