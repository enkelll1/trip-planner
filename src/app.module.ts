import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TravelsModule } from './travels/travels.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { TripModule } from './trip/trip.module';
import * as redisStore from 'cache-manager-redis-store';
import * as process from 'node:process';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL),
    ConfigModule.forRoot(),
    AuthModule,
    TravelsModule,
    CacheModule.register({
      store: redisStore,
      isGlobal: true,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      auth_pass: process.env.REDIS_PASSWORD,
    }),
    TripModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
