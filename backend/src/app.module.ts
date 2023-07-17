import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { configSchema } from './config/joi.shema';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { WishesModule } from './wishes/wishes.module';
import { OffersModule } from './offers/offers.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { HashModule } from './hash/hash.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: configSchema,
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseService,
    }),
    WinstonModule.forRoot({
      levels: {
        critical_error: 0,
        error: 1,
        special_warning: 2,
        another_log_level: 3,
        info: 4,
      },
      transports: [
        new winston.transports.Console({ format: winston.format.simple() }),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
      ],
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 20,
    }),
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
    HashModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    DatabaseService,
  ],
})
export class AppModule {}
