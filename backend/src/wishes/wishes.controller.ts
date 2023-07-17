import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UpdateWishDto } from './dto/update-wish.dto';
import { WishesService } from './wishes.service';
import { User } from 'src/users/entities/user.entity';
import { Wish } from './entities/wish.entity';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Get('last')
  getLastWishes(): Promise<Wish[]> {
    return this.wishesService.getLast();
  }

  @Get('top')
  getTopWishes(): Promise<Wish[]> {
    return this.wishesService.getTop();
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  getById(@Param('id') id: string): Promise<Wish> {
    return this.wishesService.getById(+id);
  }

  @UseGuards(JwtGuard)
  @Post()
  create(
    @Body() CreateWishDto,
    @Req() req: Request & { user: User },
  ): Promise<Wish> {
    return this.wishesService.create(CreateWishDto, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Req() req: Request & { user: User },
    @Body() updateWishDto: UpdateWishDto,
  ): Promise<unknown> {
    return this.wishesService.updateOne(+id, req.user.id, updateWishDto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Req() req: Request & { user: User },
  ): Promise<unknown> {
    return this.wishesService.removeOne(+id, req.user.id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copy(
    @Param('id') wishId: string,
    @Req() req: Request & { user: User },
  ): Promise<unknown> {
    return this.wishesService.copiedWish(+wishId, req.user.id);
  }
}
