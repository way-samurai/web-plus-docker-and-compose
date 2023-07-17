import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { DataSource, FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { WishesService } from 'src/wishes/wishes.service';
import {
  OFFER_NOT_FOUND,
  WISH_OWNER_CAN_NOT_PAY,
} from 'src/utils/constants/offer';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private wishesService: WishesService,
  ) {}

  async findOne(query: FindManyOptions<Offer>) {
    return this.offerRepository.findOne(query);
  }

  async findAll(): Promise<Offer[]> {
    return await this.offerRepository.find({
      relations: ['item', 'user'],
    });
  }

  async findById(id: number): Promise<Offer> {
    const offer = await this.offerRepository.findOne({
      where: { id },
      relations: ['item', 'user'],
    });

    if (!offer) {
      throw new NotFoundException(OFFER_NOT_FOUND);
    }

    delete offer.user.password;

    return offer;
  }

  async create(createOfferDto: CreateOfferDto, userId: number) {
    const { amount, itemId } = createOfferDto;
    const wish = await this.wishesService.findOne({
      where: { id: itemId },
      relations: ['owner'],
    });
    const { price, raised, owner } = wish;

    if (owner.id === userId) {
      throw new ForbiddenException(WISH_OWNER_CAN_NOT_PAY);
    }

    if (amount + raised > price) {
      throw new ForbiddenException(
        `Сумма взноса превышает сумму остатка стоимости подарка на ${
          amount + raised - price
        } руб.`,
      );
    }
    const offer = this.offerRepository.create({
      ...createOfferDto,
      user: { id: userId },
      item: { id: itemId },
    });

    await this.dataSource.transaction(async (transManager) => {
      await transManager.insert<Offer>(Offer, offer);
      await transManager.update<Wish>(Wish, itemId, {
        raised: amount + raised,
      });
    });
    return {};
  }
}
