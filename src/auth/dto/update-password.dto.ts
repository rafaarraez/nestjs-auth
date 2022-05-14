import { IsEmail, IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @IsNumberString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
