import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
    
    @Post('/singup')
    singUp(@Body() registerUserDto: RegisterUserDto): Promise<void>{
        return this.authService.singUp(registerUserDto);
    }

}
