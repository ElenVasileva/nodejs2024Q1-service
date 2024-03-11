import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { v4 as uuidv4, validate } from 'uuid';
import { Database } from 'src/database';

@Injectable()
export class AlbumsService {
  create(createAlbumDto: CreateAlbumDto) {
    if (!createAlbumDto.name || !createAlbumDto.year) {
      console.log(`album create: name '${createAlbumDto.name}' or year '${createAlbumDto.year}' is incorrect`);
      throw new BadRequestException();
    }
    const newAlbum = {
      id: uuidv4(),
      ...createAlbumDto,
    };
    Database.Albums.push(newAlbum);
    console.log(`album create: album '${newAlbum.name}' with id '${newAlbum.id}' was created`);
    return newAlbum;
  }

  findAll() {
    return Database.Albums;
  }

  findOne(id: string) {
    if (!validate(id)) {
      console.log(`album findOne: id '${id}' is invalid`);
      throw new BadRequestException();
    }
    const index = Database.Albums.findIndex((album) => {
      return album.id === id;
    });
    if (index === -1) {
      console.log(`album findOne: album with id '${id}' not found`);
      throw new NotFoundException();
    }
    return Database.Albums[index];
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    if (!validate(id)) {
      console.log(`album update: id '${id}' is invalid`);
      throw new BadRequestException();
    }
    if (!updateAlbumDto.name || !updateAlbumDto.year) {
      console.log(`album update: name '${updateAlbumDto.name}' or year '${updateAlbumDto.year}' is invalid`);
      throw new BadRequestException();
    }
    if (updateAlbumDto.artistId && !validate(updateAlbumDto.artistId)) {
      console.log(`album update: artistId '${updateAlbumDto.artistId}' is invalid`);
      throw new BadRequestException();
    }
    const index = Database.Albums.findIndex((album) => {
      return album.id === id;
    });
    if (index === -1) {
      console.log(`album update: album with id '${id}' not found`);
      throw new NotFoundException();
    }
    const oldAlbum = Database.Albums[index];
    Database.Albums[index] = { ...oldAlbum, ...updateAlbumDto };
    return Database.Albums[index];
  }

  remove(id: string) {
    if (!validate(id)) {
      console.log(`album remove: id '${id}' is invalid`);
      throw new BadRequestException();
    }
    const index = Database.Albums.findIndex((album) => {
      return album.id === id;
    });
    if (index === -1) {
      console.log(`album remove: album with id '${id}' not found`);
      throw new NotFoundException();
    }
    Database.Albums.splice(index, 1);
    Database.Tracks.forEach((track) => {
      if (track.albumId === id) track.albumId = null;
    });
    console.log(`album remove: album with id '${id}' was deleted`);
  }
}
