import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { SignInResponseDto } from './dto/signin-user-response.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) { }
    
    async signUp(RegisterUserDto: RegisterUserDto): Promise<void>{
        return this.userRepository.signUp(RegisterUserDto);
    }

    async signIn(signInUserDto: SignInUserDto): Promise<SignInResponseDto>{
        const email = await this.userRepository.signIn(signInUserDto);

        if (!email) {
            throw new UnauthorizedException('Invalid credentials');
        }
        
        const payload: JwtPayload = { email };
        const accessToken = await this.jwtService.sign(payload);

        return { accessToken };

    }
}
