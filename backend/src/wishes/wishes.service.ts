import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  FindManyOptions,
  FindOneOptions,
  Repository,
  In,
} from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import {
  ALREADY_OWNED,
  RAISED_NOT_NULL,
  USER_NOT_OWNER,
} from 'src/utils/constants/wishes';

@Injectable()
export class WishesService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) {}

  findAll(query: FindManyOptions<Wish>): Promise<Wish[]> {
    return this.wishesRepository.find(query);
  }

  findOne(query: FindOneOptions<Wish>): Promise<Wish> {
    return this.wishesRepository.findOne(query);
  }

  async findManyByIdArr(idArr: number[]): Promise<Wish[]> {
    return this.wishesRepository.find({
      where: { id: In(idArr) },
    });
  }

  getLast(): Promise<Wish[]> {
    return this.findAll({ order: { createdAt: 'DESC' }, take: 40 });
  }

  getTop(): Promise<Wish[]> {
    return this.findAll({ order: { copied: 'DESC' }, take: 10 });
  }

  getById(id: number): Promise<Wish> {
    return this.findOne({ where: { id }, relations: { owner: true } });
  }

  create(createWishDto: CreateWishDto, ownerId: number): Promise<Wish> {
    const wish = this.wishesRepository.create({
      ...createWishDto,
      owner: { id: ownerId },
    });
    return this.wishesRepository.save(wish);
  }

  async updateOne(
    id: number,
    userId: number,
    updateWishDto: UpdateWishDto,
  ): Promise<unknown> {
    const wish = await this.findOne({
      where: { id },
      relations: { owner: true },
    });
    if (userId !== wish.owner.id) {
      throw new ForbiddenException(USER_NOT_OWNER);
    }
    if (updateWishDto.price && wish.raised > 0) {
      throw new ForbiddenException(RAISED_NOT_NULL);
    }
    return this.wishesRepository.update(id, updateWishDto);
  }

  async removeOne(id: number, userId: number): Promise<unknown> {
    const wish = await this.findOne({
      where: { id },
      relations: { owner: true },
    });
    if (userId !== wish.owner.id) {
      throw new ForbiddenException(USER_NOT_OWNER);
    }

    this.wishesRepository.delete(id);
    return wish;
  }

  async copiedWish(wishId: number, userId: number): Promise<unknown> {
    const wish = await this.findOne({
      where: { id: wishId },
    });
    const { name, description, image, link, price, copied } = wish;

    const findWish = !!(await this.findOne({
      where: { name, link, price, owner: { id: userId } },
      relations: { owner: true },
    }));

    if (findWish) {
      throw new ForbiddenException(ALREADY_OWNED);
    }

    const wishCopy = {
      name,
      description,
      image,
      link,
      price,
      owner: { id: userId },
    };

    await this.dataSource.transaction(async (transManager) => {
      await transManager.update<Wish>(Wish, wishId, { copied: copied + 1 });
      await transManager.insert<Wish>(Wish, wishCopy);
    });

    return {};
  }
}
