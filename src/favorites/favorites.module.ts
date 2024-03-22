import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService, PrismaClient],
  exports: [FavoritesService],
})
export class FavoritesModule {}
