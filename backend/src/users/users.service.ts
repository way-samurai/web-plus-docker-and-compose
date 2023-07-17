import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashService } from 'src/hash/hash.service';
import { User } from './entities/user.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import {
  USER_ALREADY_EMAIL_EXIST,
  USER_ALREADY_USERNAME_EXIST,
} from 'src/utils/constants/users';
import { UpdateUserDto } from './dto/update-user.dto';
import { plainToClass } from 'class-transformer';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, username, password } = createUserDto;
    const userEmail = await this.findOne({
      where: [{ email }],
    });
    const userName = await this.findOne({
      where: [{ username }],
    });
    if (userEmail) {
      throw new ConflictException(USER_ALREADY_EMAIL_EXIST);
    }
    if (userName) {
      throw new ConflictException(USER_ALREADY_USERNAME_EXIST);
    }

    const hash = await this.hashService.generate(password);
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hash,
    });

    return this.usersRepository.save(newUser);
  }

  async findAll(query: FindManyOptions<User>): Promise<User[]> {
    return this.usersRepository.find(query);
  }

  async findOne(id: FindOneOptions<User>): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    return user;
  }

  async findMany(query: string): Promise<User[]> {
    return this.findAll({
      where: [{ username: query }, { email: query }],
    });
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    const { email, username, password } = updateUserDto;

    const user = await this.findOne({ where: { id } });

    if (email) {
      const emailInBase = await this.findOne({ where: { email } });

      if (emailInBase && emailInBase.id !== id) {
        throw new ConflictException(USER_ALREADY_EMAIL_EXIST);
      }
    }

    if (username) {
      const userNameInBase = await this.findOne({ where: { username } });

      if (userNameInBase && userNameInBase.id !== id) {
        throw new ConflictException(USER_ALREADY_USERNAME_EXIST);
      }
    }

    if (password) {
      updateUserDto.password = await this.hashService.generate(password);
    }

    const updateUser = { ...user, ...updateUserDto };
    await this.usersRepository.update(id, updateUser);

    return this.findOne({ where: { id } });
  }

  getByUsername(username: string): Promise<User> {
    return this.findOne({ where: { username } }).then((user) =>
      plainToClass(User, user, { excludePrefixes: ['password'] }),
    );
  }

  getMyWishes(userId: number): Promise<Wish | Wish[]> {
    return this.findOne({
      where: { id: userId },
      relationLoadStrategy: 'join',
      relations: { wishes: { owner: true } },
    }).then((user) => user.wishes);
  }

  getUserWishes(username: string): Promise<Wish | Wish[]> {
    return this.findOne({
      where: { username },
      relationLoadStrategy: 'join',
      relations: { wishes: true },
    }).then((user) => user.wishes);
  }
}
