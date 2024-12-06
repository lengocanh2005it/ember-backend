import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateSupportTicketRequestDto {
  @IsString()
  @IsNotEmpty()
  readonly request!: string;

  @IsNotEmpty()
  @IsString()
  readonly userId!: string;
}
