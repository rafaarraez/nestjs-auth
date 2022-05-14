import { IsNotEmpty, IsUUID } from "class-validator";

export class ActiveUserDto {
    @IsNotEmpty()
    @IsUUID('4')
    id: string;

    @IsNotEmpty()
    @IsUUID('4')
    code: string;
}