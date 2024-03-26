import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';
import { TracksService } from 'src/tracks/tracks.service';
import { FavoritesService } from 'src/favorites/favorites.service';
import { AppLogger } from 'src/appLogger';

@Injectable()
export class AlbumsService {
  constructor(private readonly prisma: PrismaClient, private readonly trackService: TracksService, private readonly favoriteService: FavoritesService) {}

  async create(createAlbumDto: CreateAlbumDto) {
    const newAlbum = await this.prisma.album.create({
      data: {
        id: uuidv4(),
        ...createAlbumDto,
      },
    });
    AppLogger.info(`album create: album '${newAlbum.name}' with id '${newAlbum.id}' was created`);
    return newAlbum;
  }

  async findAll() {
    const list = await this.prisma.album.findMany();
    AppLogger.info(`findAll: find ${list.length} tracks`);
    return list;
  }

  async findOne(id: string) {
    const album = await this.prisma.album.findUnique({
      where: {
        id: id,
      },
    });
    if (!album) {
      AppLogger.info(`album findOne: album with id '${id}' not found`);
      throw new NotFoundException();
    }
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const album = await this.prisma.album.findUnique({
      where: {
        id: id,
      },
    });
    if (!album) {
      AppLogger.info(`album update: album with id '${id}' not found`);
      throw new NotFoundException();
    }
    const updatedAlbum = await this.prisma.album.update({
      where: { id: id },
      data: {
        ...updateAlbumDto,
      },
    });
    AppLogger.info(`album update: album with id '${id}' and name '${updatedAlbum.name}' updated`);
    return updatedAlbum;
  }

  async remove(id: string) {
    const album = await this.prisma.album.findUnique({
      where: {
        id: id,
      },
    });
    if (!album) {
      AppLogger.info(`album remove: album with id '${id}' not found`);
      throw new NotFoundException();
    }

    this.favoriteService.remove('album', id);
    this.trackService.removeAlbumLink(id);
    await this.prisma.album.delete({
      where: {
        id: id,
      },
    });
    AppLogger.info(`album remove: album with id '${id}' was deleted`);
  }

  async removeArtistLink(id: string) {
    await this.prisma.album.updateMany({
      where: { artistId: id },
      data: {
        artistId: null,
      },
    });
  }
}
