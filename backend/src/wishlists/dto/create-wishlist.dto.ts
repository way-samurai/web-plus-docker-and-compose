import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @Length(1, 250, {
    message: 'Название должно быть от 2 до 250 символов',
  })
  name: string;

  @IsString()
  @IsUrl()
  image: string;

  @IsArray()
  @IsNumber({}, { each: true })
  itemsId: number[];

  @MaxLength(1500, {
    message: 'Максимальная длина не должна превышать 1500 символов',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
