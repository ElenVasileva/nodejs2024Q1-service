import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';
import { TracksService } from 'src/tracks/tracks.service';

@Injectable()
export class AlbumsService {
  constructor(private readonly prisma: PrismaClient, private readonly trackService: TracksService) {}

  async create(createAlbumDto: CreateAlbumDto) {
    const newAlbum = await this.prisma.album.create({
      data: {
        id: uuidv4(),
        ...createAlbumDto,
      },
    });
    console.log(`album create: album '${newAlbum.name}' with id '${newAlbum.id}' was created`);
    return newAlbum;
  }

  async findAll() {
    const list = await this.prisma.album.findMany();
    console.log(`findAll: find ${list.length} tracks`);
    return list;
  }

  async findOne(id: string) {
    const album = await this.prisma.album.findUnique({
      where: {
        id: id,
      },
    });
    if (!album) {
      console.log(`album findOne: album with id '${id}' not found`);
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
      console.log(`album update: album with id '${id}' not found`);
      throw new NotFoundException();
    }
    const updatedAlbum = await this.prisma.album.update({
      where: { id: id },
      data: {
        ...updateAlbumDto,
      },
    });
    console.log(`album update: album with id '${id}' and name '${updatedAlbum.name}' updated`);
    return updatedAlbum;
  }

  async remove(id: string) {
    const album = await this.prisma.album.findUnique({
      where: {
        id: id,
      },
    });
    if (!album) {
      console.log(`album remove: album with id '${id}' not found`);
      throw new NotFoundException();
    }

    this.trackService.removeAlbumLink(id);
    await this.prisma.album.delete({
      where: {
        id: id,
      },
    });
    console.log(`album remove: album with id '${id}' was deleted`);
  }

  async removeArtistLink(id: string) {
    console.log(`isn't implemented yet`);
  }
}
