import { v4 as uuidv4 } from 'uuid';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class TracksService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(createTrackDto: CreateTrackDto) {
    const track = await this.prisma.track.create({
      data: {
        id: uuidv4(),
        ...createTrackDto,
      },
    });
    console.log(`track '${track.name}' with id '${track.id}' was created`);
    return track;
  }

  async findAll() {
    const list = await this.prisma.track.findMany();
    console.log(`findAll: find ${list.length} tracks`);
    return list;
  }

  async findOne(id: string) {
    const track = await this.prisma.track.findUnique({
      where: {
        id: id,
      },
    });
    if (!track) {
      console.log(`findOne: track with id '${id}' not found`);
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
      console.log(`update: track with id '${id}' not found`);
      throw new NotFoundException();
    }
    const updatedTrack = await this.prisma.track.update({
      where: { id: id },
      data: {
        ...updateTrackDto,
      },
    });
    console.log(`update: track with id '${id}' and name '${updatedTrack.name}' updated`);
    return updatedTrack;
  }

  async remove(id: string) {
    const track = await this.prisma.track.findUnique({
      where: {
        id: id,
      },
    });
    if (!track) {
      console.log(`remove: track with id '${id}' not found`);
      throw new NotFoundException();
    }

    await this.prisma.track.delete({
      where: {
        id: id,
      },
    });
    console.log(`remove: track with id '${id}' was deleted`);
  }

  async removeArtistLink(id: string) {
    console.log(`isn't implemented yet`);
  }
  async removeAlbumLink(id: string) {
    console.log(`isn't implemented yet`);
  }
}
