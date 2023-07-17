import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistsController } from './wishlists.controller';
import { WishList } from './entities/wishlist.entity';
import { WishlistsService } from './wishlists.service';

@Module({
  imports: [TypeOrmModule.forFeature([WishList])],
  controllers: [WishlistsController],
  providers: [WishlistsService],
  exports: [WishlistsService],
})
export class WishlistsModule {}
