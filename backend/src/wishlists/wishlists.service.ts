import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository, Not } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WishList } from './entities/wishlist.entity';
import { USER_NOT_OWNER } from 'src/utils/constants/wishes';
import { WISHLIST_NOT_FOUND } from 'src/utils/constants/wishlists';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(WishList)
    private wishlistRepository: Repository<WishList>,
  ) {}

  async findAll(query: FindManyOptions<WishList>): Promise<WishList[]> {
    return this.wishlistRepository.find(query);
  }

  async findOne(query: FindOneOptions<WishList>): Promise<WishList> {
    return this.wishlistRepository.findOne(query);
  }

  async getWishLists(id: number): Promise<WishList[]> {
    return this.findAll({
      where: { owner: { id: Not(id) } },
      relations: ['items', 'owner'],
    });
  }

  async getById(id: number): Promise<WishList> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: ['owner', 'items'],
    });

    if (!wishlist) {
      throw new NotFoundException(WISHLIST_NOT_FOUND);
    }

    return wishlist;
  }

  async create(
    createWishListDto: CreateWishlistDto,
    ownerId: number,
  ): Promise<WishList> {
    const { itemsId, ...rest } = createWishListDto;
    const items = itemsId.map((id) => ({ id }));
    const wishList = this.wishlistRepository.create({
      ...rest,
      items,
      owner: { id: ownerId },
    });

    return this.wishlistRepository.save(wishList);
  }

  async update(
    id: number,
    updateWishListDto: UpdateWishlistDto,
    userId: number,
  ): Promise<WishList> {
    const wishList = await this.findOne({
      where: { id },
      relations: { owner: true },
    });
    if (!wishList) {
      throw new NotFoundException(WISHLIST_NOT_FOUND);
    }
    if (wishList.owner.id !== userId) {
      throw new ForbiddenException(USER_NOT_OWNER);
    }
    const { itemsId, ...rest } = updateWishListDto;
    const items = itemsId.map((id) => ({ id }));
    const updatedWishList = { ...rest, items };
    await this.wishlistRepository.update(id, updatedWishList);

    return this.findOne({ where: { id } });
  }

  async delete(id: number, userId: number): Promise<WishList> {
    const wishList = await this.findOne({
      where: { id },
      relations: { owner: true },
    });
    if (!wishList) {
      throw new NotFoundException(WISHLIST_NOT_FOUND);
    }

    if (wishList.owner.id !== userId) {
      throw new ForbiddenException(USER_NOT_OWNER);
    }
    await this.wishlistRepository.delete(id);

    return wishList;
  }
}
