import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RecoverPasswordDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
