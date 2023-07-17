import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import {
  IsString,
  Length,
  IsUrl,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { MainEntity } from 'src/custom-entities/main.entity';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Entity()
export class WishList extends MainEntity {
  @Column({
    type: 'varchar',
    length: 250,
  })
  @IsString()
  @Length(1, 250)
  name: string;

  @Column({
    type: 'varchar',
    length: 1500,
    nullable: true,
  })
  @IsOptional()
  @MaxLength(1500)
  @IsString()
  description: string;

  @Column({
    nullable: true,
  })
  @IsUrl()
  image: string;

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;

  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];
}
