import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  readonly title!: string;

  @IsString()
  @IsNotEmpty()
  readonly content!: string;

  @IsString()
  @IsNotEmpty()
  readonly image!: string;

  @IsString()
  @IsNotEmpty()
  readonly userId!: string;
}
