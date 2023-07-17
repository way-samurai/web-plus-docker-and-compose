import {
  IsString,
  Length,
  IsEmail,
  IsUrl,
  IsOptional,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 30, {
    message: 'Имя должно быть от 2 до 30 символов',
  })
  username: string;

  @IsString()
  @Length(2, 200, {
    message: 'Описание должно быть от 2 до 200 символов',
  })
  @IsOptional()
  about: string;

  @IsOptional()
  @IsString()
  @IsUrl({}, { message: 'Введите корректную ссылку' })
  avatar: string;

  @IsString()
  @IsEmail({}, { message: 'Введите корректный Email' })
  email: string;

  @IsString()
  @MinLength(4, { message: 'Пароль должен быть длинной минимум 4 символа' })
  password: string;
}
