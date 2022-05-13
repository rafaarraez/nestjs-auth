import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { SingInResponseDto } from './dto/singin-user-response.dto';
import { SingInUserDto } from './dto/singin-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
    
    @Post('/singup')
    singUp(@Body() registerUserDto: RegisterUserDto): Promise<void>{
        return this.authService.singUp(registerUserDto);
    }

    @Post('/singin')
    singIn(@Body() singInUserDto: SingInUserDto): Promise<SingInResponseDto> {
        return this.authService.singIn(singInUserDto);
    }


}
