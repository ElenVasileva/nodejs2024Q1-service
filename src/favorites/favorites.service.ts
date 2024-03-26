import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Album } from 'src/albums/entities/album.entity';
import { AppLogger } from 'src/appLogger';
import { Artist } from 'src/artists/entities/artist.entity';
import { Track } from 'src/tracks/entities/track.entity';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(entityType: string, id: string) {
    try {
      if (entityType === 'track') {
        await this.prisma.favoriteTrack.create({ data: { trackId: id } });
      }
      if (entityType === 'album') {
        await this.prisma.favoriteAlbum.create({ data: { albumId: id } });
      }
      if (entityType === 'artist') {
        await this.prisma.favoriteArtist.create({ data: { artistId: id } });
      }
      AppLogger.info(`add favorite: ${entityType} with id '${id}' has added`);
    } catch {
      throw new UnprocessableEntityException();
    }
  }

  async findAll(): Promise<{ artists: Artist[]; albums: Album[]; tracks: Track[] }> {
    const artists = (
      await this.prisma.favoriteArtist.findMany({
        select: { artist: true },
      })
    ).map((d) => d.artist);

    const albums = (
      await this.prisma.favoriteAlbum.findMany({
        select: { album: true },
      })
    ).map((d) => d.album);

    const tracks = (
      await this.prisma.favoriteTrack.findMany({
        select: { track: true },
      })
    ).map((d) => d.track);

    AppLogger.info('get all favorites');
    return { artists, albums, tracks };
  }

  async remove(entityType: string, id: string) {
    AppLogger.info(`remove favorite: ${entityType} with id '${id}'`);

    if (entityType === 'track') {
      await this.prisma.favoriteTrack.deleteMany({ where: { trackId: id } });
    }
    if (entityType === 'album') {
      await this.prisma.favoriteAlbum.deleteMany({ where: { albumId: id } });
    }
    if (entityType === 'artist') {
      await this.prisma.favoriteArtist.deleteMany({ where: { artistId: id } });
    }
    AppLogger.info(`remove favorite: ${entityType} with id '${id}' has removed`);
  }
}
