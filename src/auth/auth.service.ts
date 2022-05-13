import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { SingInResponseDto } from './dto/singin-user-response.dto';
import { SingInUserDto } from './dto/singin-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) { }
    
    async singUp(RegisterUserDto: RegisterUserDto): Promise<void>{
        return this.userRepository.singUp(RegisterUserDto);
    }

    async singIn(singInUserDto: SingInUserDto): Promise<SingInResponseDto>{
        const email = await this.userRepository.singIn(singInUserDto);

        if (!email) {
            throw new UnauthorizedException('Invalid credentials');
        }
        
        const payload: JwtPayload = { email };
        const accessToken = await this.jwtService.sign(payload);

        return { accessToken };

    }
}
