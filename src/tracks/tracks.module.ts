import { Module } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { PrismaClient } from '@prisma/client';
import { FavoritesModule } from 'src/favorites/favorites.module';

@Module({
  controllers: [TracksController],
  providers: [TracksService, PrismaClient],
  exports: [TracksService],
  imports: [FavoritesModule],
})
export class TracksModule {}
