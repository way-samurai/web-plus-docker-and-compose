import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { IsString, Length, IsUrl, IsInt } from 'class-validator';
import { MainEntity } from 'src/custom-entities/main.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Wish extends MainEntity {
  @Column({
    type: 'varchar',
    length: 250,
  })
  @IsString()
  @Length(1, 250)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsInt()
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @IsInt()
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @Column({
    type: 'varchar',
    length: 1024,
  })
  @IsString()
  @Length(1, 1024)
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  @Column({ default: 0, nullable: true })
  @IsInt()
  copied: number;
}
