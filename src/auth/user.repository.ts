import { ConflictException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { RegisterUserDto } from "./dto/register-user.dto";
import { User } from "./entities/user.entity";
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async singUp(registerUserDto: RegisterUserDto): Promise<void>{
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

     private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}