import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class  RegisterUserDto{
    @IsNotEmpty()
    @IsString()
    @Length(2, 20)
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Length(6, 20)
    password: string;

    @IsOptional()
    activationToken: string;
}