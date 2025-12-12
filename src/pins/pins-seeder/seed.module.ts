import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pin } from '../entities/pins.entity';
import { Hashtag } from '../entities/hashtag.entity';
import { Category } from '../../categories/category.entity';
import { User } from '../../users/entities/user.entity';
import { PinsSeeder } from './pins.seed';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pin, Hashtag, Category, User]),
  ],
  providers: [PinsSeeder],
  exports: [PinsSeeder],
})
export class SeedModule {}