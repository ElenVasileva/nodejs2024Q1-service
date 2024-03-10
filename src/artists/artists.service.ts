import { v4 as uuidv4, validate } from 'uuid';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';

@Injectable()
export class ArtistsService {
  private readonly artists: Artist[] = [];

  create(createArtistDto: CreateArtistDto) {
    if (!createArtistDto.name || (createArtistDto.grammy !== false && createArtistDto.grammy !== true)) {
      console.log(`name '${createArtistDto.name}' or grammy '${createArtistDto.grammy}' is incorrect`);
      throw new BadRequestException();
    }
    const newArtist = {
      id: uuidv4(),
      ...createArtistDto,
    };
    this.artists.push(newArtist);
    console.log(`artist '${newArtist.name}' with id '${newArtist.id}' was created`);
    return newArtist;
  }

  findAll() {
    return this.artists;
  }

  findOne(id: string) {
    if (!validate(id)) {
      console.log(`findOne: id '${id}' is invalid`);
      throw new BadRequestException();
    }
    const index = this.artists.findIndex((artist) => {
      return artist.id === id;
    });
    if (index === -1) {
      console.log(`findOne: artist with id '${id}' not found`);
      throw new NotFoundException();
    }
    return this.artists[index];
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
    const index = this.artists.findIndex((artist) => {
      return artist.id === id;
    });
    if (index === -1) {
      console.log(`update: artist with id '${id}' not found`);
      throw new NotFoundException();
    }
    const oldArtist = this.artists[index];
    this.artists[index] = { ...oldArtist, ...updateArtistDto };
    return this.artists[index];
  }

  remove(id: string) {
    if (!validate(id)) {
      console.log(`id '${id}' is invalid`);
      throw new BadRequestException();
    }
    const index = this.artists.findIndex((artist) => {
      return artist.id === id;
    });
    if (index === -1) {
      console.log(`remove: artist with id '${id}' not found`);
      throw new NotFoundException();
    }
    console.log(`remove: artist with id '${id}' was deleted`);
    this.artists.splice(index, 1);
  }
}
