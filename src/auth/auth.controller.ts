import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ActiveUserDto } from './dto/activate-user.dto';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { SignInResponseDto } from './dto/signin-user-response.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './entities/user.entity';

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

    @Get('/activate-account')
    activateAccount(@Query() activeUserDto: ActiveUserDto): Promise<User>{
       return this.authService.activateUser(activeUserDto);
    }

    @Post('/recover-password')
    requestRecoverPassword(@Body() recoverPasswordDto: RecoverPasswordDto): Promise<void> {
        return this.authService.requestPasswordRecovery(recoverPasswordDto);
    }

    @Post('/update-password')
    updatePassword(@Body() updatePasswordDto: UpdatePasswordDto): Promise<void> {
    return this.authService.updatePassword(updatePasswordDto);
  }

}
