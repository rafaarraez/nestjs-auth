import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { SignInResponseDto } from './dto/signin-user-response.dto';
import { SignInUserDto } from './dto/signin-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }
    
    @Post('/signup')
    signUp(@Body() registerUserDto: RegisterUserDto): Promise<void>{
        return this.authService.signUp(registerUserDto);
    }

    @Post('/signin')
    signIn(@Body() signInUserDto: SignInUserDto): Promise<SignInResponseDto> {
        return this.authService.signIn(signInUserDto);
    }


}
