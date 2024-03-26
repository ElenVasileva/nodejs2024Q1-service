import { v4 as uuidv4 } from 'uuid';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { PrismaClient } from '@prisma/client';
import { FavoritesService } from 'src/favorites/favorites.service';
import { AppLogger } from 'src/appLogger';

@Injectable()
export class TracksService {
  constructor(private readonly prisma: PrismaClient, private readonly favoriteService: FavoritesService) {}

  async create(createTrackDto: CreateTrackDto) {
    const track = await this.prisma.track.create({
      data: {
        id: uuidv4(),
        ...createTrackDto,
      },
    });
    AppLogger.info(`track '${track.name}' with id '${track.id}' was created`);
    return track;
  }

  async findAll() {
    const list = await this.prisma.track.findMany();
    AppLogger.info(`findAll: find ${list.length} tracks`);
    return list;
  }

  async findOne(id: string) {
    const track = await this.prisma.track.findUnique({
      where: {
        id: id,
      },
    });
    if (!track) {
      AppLogger.info(`findOne: track with id '${id}' not found`);
      throw new NotFoundException();
    }
    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = await this.prisma.track.findUnique({
      where: {
        id: id,
      },
    });
    if (!track) {
      AppLogger.info(`update: track with id '${id}' not found`);
      throw new NotFoundException();
    }
    const updatedTrack = await this.prisma.track.update({
      where: { id: id },
      data: {
        ...updateTrackDto,
      },
    });
    AppLogger.info(`update: track with id '${id}' and name '${updatedTrack.name}' updated`);
    return updatedTrack;
  }

  async remove(id: string) {
    const track = await this.prisma.track.findUnique({
      where: {
        id: id,
      },
    });
    if (!track) {
      AppLogger.info(`remove: track with id '${id}' not found`);
      throw new NotFoundException();
    }

    this.favoriteService.remove('track', id);
    await this.prisma.track.delete({
      where: {
        id: id,
      },
    });
    AppLogger.info(`remove: track with id '${id}' was deleted`);
  }

  async removeArtistLink(id: string) {
    await this.prisma.track.updateMany({
      where: { artistId: id },
      data: {
        artistId: null,
      },
    });
  }
  async removeAlbumLink(id: string) {
    await this.prisma.track.updateMany({
      where: { albumId: id },
      data: {
        albumId: null,
      },
    });
  }
}
