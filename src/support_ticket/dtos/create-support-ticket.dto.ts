import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSupportTicketDto {
  @IsString()
  @IsNotEmpty()
  readonly request!: string;

  @IsString()
  @IsNotEmpty()
  readonly userId!: string;
}
