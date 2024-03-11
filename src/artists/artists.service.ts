import { v4 as uuidv4, validate } from 'uuid';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Database } from 'src/database';

@Injectable()
export class ArtistsService {
  create(createArtistDto: CreateArtistDto) {
    if (!createArtistDto.name || (createArtistDto.grammy !== false && createArtistDto.grammy !== true)) {
      console.log(`name '${createArtistDto.name}' or grammy '${createArtistDto.grammy}' is incorrect`);
      throw new BadRequestException();
    }
    const newArtist = {
      id: uuidv4(),
      ...createArtistDto,
    };
    Database.Artists.push(newArtist);
    console.log(`artist '${newArtist.name}' with id '${newArtist.id}' was created`);
    return newArtist;
  }

  findAll() {
    return Database.Artists;
  }

  findOne(id: string) {
    if (!validate(id)) {
      console.log(`findOne: id '${id}' is invalid`);
      throw new BadRequestException();
    }
    const index = Database.Artists.findIndex((artist) => {
      return artist.id === id;
    });
    if (index === -1) {
      console.log(`findOne: artist with id '${id}' not found`);
      throw new NotFoundException();
    }
    return Database.Artists[index];
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    if (!validate(id)) {
      // || updateArtistDto.name || updateArtistDto.grammy !== true && updateArtistDto.grammy !== false) {
      console.log(`update: id '${id}' is invalid`);
      throw new BadRequestException();
    }
    if (!updateArtistDto.name || (updateArtistDto.grammy !== true && updateArtistDto.grammy !== false)) {
      console.log(`update: name '${updateArtistDto.name}' or grammy '${updateArtistDto.grammy}' is invalid`);
      throw new BadRequestException();
    }
    const index = Database.Artists.findIndex((artist) => {
      return artist.id === id;
    });
    if (index === -1) {
      console.log(`update: artist with id '${id}' not found`);
      throw new NotFoundException();
    }
    const oldArtist = Database.Artists[index];
    Database.Artists[index] = { ...oldArtist, ...updateArtistDto };
    return Database.Artists[index];
  }

  remove(id: string) {
    if (!validate(id)) {
      console.log(`id '${id}' is invalid`);
      throw new BadRequestException();
    }
    const index = Database.Artists.findIndex((artist) => {
      return artist.id === id;
    });
    if (index === -1) {
      console.log(`remove: artist with id '${id}' not found`);
      throw new NotFoundException();
    }
    Database.Artists.splice(index, 1);
    Database.Tracks.forEach((track) => {
      if (track.artistId === id) track.artistId = null;
    });
    Database.Albums.forEach((album) => {
      if (album.artistId === id) album.artistId = null;
    });
    console.log(`remove: artist with id '${id}' was deleted`);
  }
}
