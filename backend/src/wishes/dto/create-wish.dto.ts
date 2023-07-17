import {
  IsNumber,
  IsPositive,
  IsString,
  IsUrl,
  Length,
  Min,
} from 'class-validator';

export class CreateWishDto {
  @IsString()
  @Length(1, 250, {
    message: 'Название должно быть от 1 до 250 символов',
  })
  name: string;

  @IsString()
  @IsUrl({}, { message: 'Введите корректную ссылку' })
  link: string;

  @IsString()
  @IsUrl({}, { message: 'Введите корректную ссылку' })
  image: string;

  @IsNumber()
  @Min(1)
  @IsPositive()
  price: number;

  @IsString()
  @Length(1, 1024, { message: 'Описание должно быть от 1 до 1024 символов' })
  description: string;
}
