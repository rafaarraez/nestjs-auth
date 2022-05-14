import { BadRequestException, Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';
import { Repository } from 'typeorm';
import { ActiveUserDto } from './dto/activate-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { SignInResponseDto } from './dto/signin-user-response.dto';
import { SignInUserDto } from './dto/signin-user.dto';
import { RecoverPassword } from './entities/recover-password.entity';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserRepository } from './user.repository';
import { randomInt } from 'crypto';
import { utc } from 'moment/moment';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import * as bcrypt from 'bcrypt';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        @InjectRepository(RecoverPassword)
        private readonly recoverPasswordRepository: Repository<RecoverPassword>,
        private jwtService: JwtService
    ) { }

    async signUp(RegisterUserDto: RegisterUserDto): Promise<void> {
        return this.userRepository.signUp(RegisterUserDto);
    }

    async signIn(signInUserDto: SignInUserDto): Promise<SignInResponseDto> {
        const email = await this.userRepository.signIn(signInUserDto);

        if (!email) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload: JwtPayload = { email };
        const accessToken = await this.jwtService.sign(payload);

        return { accessToken };

    }

    async activateUser(activeUserDto: ActiveUserDto): Promise<User> {
        const user = await this.userRepository.findUserByActivation(activeUserDto);
        if (!user) {
            throw new UnprocessableEntityException("This action can't be done");
        }
        return this.userRepository.activeUser(user);

    }

    async requestPasswordRecovery(recoverPasswordDto: RecoverPasswordDto): Promise<void> {
        const { email } = recoverPasswordDto;
        const user = await this.userRepository.findOne({ email }, { select: ['id', 'email'] });

        if (!user) {
            throw new NotFoundException();
        }

        const code = randomInt(100_000, 1_000_000).toString();
        const expiration = utc().add(4, 'hours');

        const recover = await this.recoverPasswordRepository.findOne({ email }, { select: ['id', 'email'] });

        await this.recoverPasswordRepository.save({ ...recover, code, expiration, email, valid: true });

    }

    async updatePassword(updatePasswordDto: UpdatePasswordDto): Promise<void> {
    const { email, code, password } = updatePasswordDto;
    const userPromise = this.userRepository.findOne({ email }, { select: ['id'] });

    const recoverPassword = await this.recoverPasswordRepository.findOne({ email, valid: true, code });

    if (!recoverPassword) {
      throw new BadRequestException('Code is not valid.');
    }

    recoverPassword.valid = false;
    await this.recoverPasswordRepository.save(recoverPassword);

    const now = utc();
    const isCodeAlreadyExpired = now.isAfter(recoverPassword.expiration);

    if (isCodeAlreadyExpired) {
      throw new BadRequestException('Code is already expired.');
    }
    
    await this.recoverPasswordRepository.delete({ email, valid: true, code });
        
    const user = await userPromise;
    user.password = await bcrypt.hash(password, await bcrypt.genSalt());;
    await this.userRepository.save(user);
  }
}
