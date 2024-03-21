import { v4 as uuidv4 } from 'uuid';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { TracksService } from 'src/tracks/tracks.service';
import { AlbumsService } from 'src/albums/albums.service';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ArtistsService {
  constructor(private readonly prisma: PrismaClient, private readonly trackService: TracksService, private readonly albumService: AlbumsService) {}

  async create(createArtistDto: CreateArtistDto) {
    const artist = await this.prisma.artist.create({
      data: {
        id: uuidv4(),
        ...createArtistDto,
      },
    });
    console.log(`artist '${artist.name}' with id '${artist.id}' was created`);
    return artist;
  }

  async findAll() {
    const list = await this.prisma.artist.findMany();
    console.log(`findAll: find ${list.length} artists`);
    return list;
  }

  async findOne(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: {
        id: id,
      },
    });
    if (!artist) {
      console.log(`findOne: artist with id '${id}' not found`);
      throw new NotFoundException();
    }
    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    const artist = await this.prisma.artist.findUnique({
      where: {
        id: id,
      },
    });
    if (!artist) {
      console.log(`update: artist with id '${id}' not found`);
      throw new NotFoundException();
    }

    const newArtist = await this.prisma.artist.update({
      where: { id: id },
      data: {
        ...updateArtistDto,
      },
    });
    return newArtist;
  }

  async remove(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: {
        id: id,
      },
    });
    if (!artist) {
      console.log(`remove: artist with id '${id}' not found`);
      throw new NotFoundException();
    }
    this.albumService.removeArtistLink(id);
    this.trackService.removeArtistLink(id);
    await this.prisma.artist.delete({
      where: {
        id: id,
      },
    });
    console.log(`remove: artist with id '${id}' was deleted`);
  }
}
