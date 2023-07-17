import { Entity, Column, OneToMany } from 'typeorm';
import {
  IsString,
  Length,
  IsEmail,
  IsUrl,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Exclude } from 'class-transformer';
import { MainEntity } from 'src/custom-entities/main.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { WishList } from 'src/wishlists/entities/wishlist.entity';
import {
  ABOUT_DEFAULT_TEXT,
  AVATAR_DEFAULT_LINK,
} from 'src/utils/constants/users';

@Entity()
export class User extends MainEntity {
  @Column({
    type: 'varchar',
    unique: true,
    length: 30,
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 30)
  username: string;

  @Column({
    type: 'varchar',
    length: 200,
    default: ABOUT_DEFAULT_TEXT,
  })
  @IsOptional()
  @IsString()
  @Length(2, 200)
  about: string;

  @Column({
    default: AVATAR_DEFAULT_LINK,
  })
  @IsOptional()
  @IsUrl()
  avatar: string;

  @Column({
    unique: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Column()
  @Exclude()
  @IsString()
  @IsNotEmpty()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => WishList, (wishlist) => wishlist.owner)
  wishlists: WishList[];
}
