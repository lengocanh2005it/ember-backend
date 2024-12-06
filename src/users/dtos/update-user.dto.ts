import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserUpdateDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsString()
  @IsNotEmpty()
  readonly job!: string;

  @IsString()
  @IsNotEmpty()
  readonly email!: string;

  @IsString()
  @IsNotEmpty()
  readonly phone!: string;

  @IsString()
  @IsNotEmpty()
  readonly address!: string;

  @IsOptional()
  readonly username!: string;

  @IsOptional()
  readonly image?: string;

  @IsOptional()
  readonly total_orders?: number;

  @IsOptional()
  readonly current_reservations?: number;

  @IsOptional()
  readonly loyalty_points?: number;
}
