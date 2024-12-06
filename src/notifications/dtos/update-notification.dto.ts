import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateNotificationDto {
  @IsString()
  @IsNotEmpty()
  readonly title!: string;

  @IsString()
  @IsNotEmpty()
  readonly content!: string;

  @IsString()
  @IsNotEmpty()
  readonly image!: string;
}
