import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { CreateUserDto } from './user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
  ) { }
  async create(createUserDto: CreateUserDto) {
    const { email, name, password } = createUserDto;
    const user = new User(name, password, email);
    try {
      await this.userRepository.save(user);
    } catch {
      throw new BadRequestException();
    }
    delete user.password;
    return user;
  }
  async findOne(id: string) {
    const user = this.userRepository.findOne({
      where: { id },
    });
    return user;
  }
  async findAll() {
    const users = this.userRepository.find({ select: ['email', 'name'] });
    return users;
  }
  async findOneByEmail(email: string) {
    const user = this.userRepository.findOne({ where: { email } });
    return user;
  }
}
