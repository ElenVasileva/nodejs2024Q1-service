import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';
import { AlbumsModule } from 'src/albums/albums.module';
import { TracksModule } from 'src/tracks/tracks.module';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [ArtistsController],
  providers: [ArtistsService, PrismaClient],
  imports: [AlbumsModule, TracksModule],
})
export class ArtistsModule {}
