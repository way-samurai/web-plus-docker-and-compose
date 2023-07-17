import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { User } from './entities/user.entity';
import { SearchUserDto } from './dto/search-user.dto';
import { Wish } from 'src/wishes/entities/wish.entity';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getUser(@Req() req: Request & { user: User }): Promise<User> {
    return req.user;
  }

  @Get('me/wishes')
  async getMyWishes(
    @Req() req: Request & { user: User },
  ): Promise<Wish | Wish[]> {
    return this.usersService.getMyWishes(req.user.id);
  }

  @Get(':username')
  async getByUsername(@Param('username') username: string): Promise<User> {
    return this.usersService.getByUsername(username);
  }

  @Get(':username/wishes')
  getUserWishes(@Param('username') username: string): Promise<Wish | Wish[]> {
    return this.usersService.getUserWishes(username);
  }

  @Patch('me')
  updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request & { user: User },
  ): Promise<User> {
    return this.usersService.updateOne(req.user.id, updateUserDto);
  }

  @Post('find')
  findByUserNameOrEmail(@Body() searchUserDto: SearchUserDto): Promise<User[]> {
    const { query } = searchUserDto;
    return this.usersService.findMany(query);
  }
}
