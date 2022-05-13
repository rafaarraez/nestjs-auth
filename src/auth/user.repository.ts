import { ConflictException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { RegisterUserDto } from "./dto/register-user.dto";
import { User } from "./entities/user.entity";
import * as bcrypt from 'bcrypt';
import { SignInUserDto } from "./dto/signin-user.dto";
import { SignInResponseDto } from "./dto/signin-user-response.dto";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async signUp(registerUserDto: RegisterUserDto): Promise<void>{
        const { name, email, password } = registerUserDto;
        const hashedPassword = await this.hashPassword(password, await bcrypt.genSalt());
        const user = this.create({ name, email, password: hashedPassword });
        try { 
            await this.save(user);
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('email already exists');
            } else {
                console.log(error);
            }
        }
    }

    async signIn(signInUserDto: SignInUserDto): Promise<string> {
        const { email, password } = signInUserDto;
        const user = await this.findOne({ email });
        if (user && bcrypt.compare(password, user.password)) {
            return user.email;
        }
        return null;
    }

     private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}