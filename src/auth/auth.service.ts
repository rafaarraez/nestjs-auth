import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ) { }
    
    async singUp(RegisterUserDto: RegisterUserDto): Promise<void>{
        return this.userRepository.singUp(RegisterUserDto);
    }
}
