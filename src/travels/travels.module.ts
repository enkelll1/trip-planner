import { Module } from '@nestjs/common';
import { TravelsController } from './travels.controller';
import { TravelsService } from './travels.service';
import { CacheUtil } from '../utils/cache.util';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [TravelsController],
  providers: [TravelsService, CacheUtil],
})
export class TravelsModule {}
