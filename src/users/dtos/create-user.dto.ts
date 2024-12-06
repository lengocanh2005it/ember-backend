import { IsNotEmpty, IsString, MinLength } from 'class-validator';
export class UserCreateDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'username must be at least 3 characters long.' })
  readonly username!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1, { message: 'password cannot be empty.' })
  readonly password!: string;
}
