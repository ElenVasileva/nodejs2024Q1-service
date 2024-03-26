import { Module } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { PrismaClient } from '@prisma/client';
import { TracksModule } from 'src/tracks/tracks.module';
import { FavoritesModule } from 'src/favorites/favorites.module';

@Module({
  controllers: [AlbumsController],
  providers: [AlbumsService, PrismaClient],
  exports: [AlbumsService],
  imports: [TracksModule, FavoritesModule],
})
export class AlbumsModule {}
