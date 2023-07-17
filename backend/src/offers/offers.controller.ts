import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { OffersService } from './offers.service';
import { Offer } from './entities/offer.entity';
import { User } from 'src/users/entities/user.entity';

@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(@Body() CreateOfferDto, @Req() req: Request & { user: User }) {
    return this.offersService.create(CreateOfferDto, req.user.id);
  }

  @Get()
  getAll(): Promise<Offer[]> {
    return this.offersService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): Promise<Offer> {
    return this.offersService.findById(+id);
  }
}
