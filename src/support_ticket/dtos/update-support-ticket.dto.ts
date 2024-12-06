import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateSupportTicketDto {
  @IsString()
  @IsNotEmpty()
  readonly response!: string;

  @IsString()
  @IsNotEmpty()
  readonly status!: string;
}
