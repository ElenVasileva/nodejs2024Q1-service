import { v4 as uuidv4, validate } from 'uuid';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Database } from 'src/database';

@Injectable()
export class TracksService {
  create(createTrackDto: CreateTrackDto) {
    if (!createTrackDto.name || (!createTrackDto.duration && createTrackDto.duration !== 0)) {
      console.log(`name '${createTrackDto.name}' or duration '${createTrackDto.duration}' is incorrect`);
      throw new BadRequestException();
    }
    const newTrack = {
      id: uuidv4(),
      ...createTrackDto,
    };
    Database.Tracks.push(newTrack);
    console.log(`track '${newTrack.name}' with id '${newTrack.id}' was created`);
    return newTrack;
  }

  findAll() {
    return Database.Tracks;
  }

  findOne(id: string) {
    if (!validate(id)) {
      console.log(`findOne: id '${id}' is invalid`);
      throw new BadRequestException();
    }
    const index = Database.Tracks.findIndex((track) => {
      return track.id === id;
    });
    if (index === -1) {
      console.log(`findOne: track with id '${id}' not found`);
      throw new NotFoundException();
    }
    return Database.Tracks[index];
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    if (!validate(id)) {
      console.log(`update: id '${id}' is invalid`);
      throw new BadRequestException();
    }
    if (!updateTrackDto.name || (!updateTrackDto.duration && updateTrackDto.duration !== 0)) {
      console.log(`update: name '${updateTrackDto.name}' or duration '${updateTrackDto.duration}' is invalid`);
      throw new BadRequestException();
    }
    const index = Database.Tracks.findIndex((track) => {
      return track.id === id;
    });
    if (index === -1) {
      console.log(`update: track with id '${id}' not found`);
      throw new NotFoundException();
    }
    const oldTrack = Database.Tracks[index];
    Database.Tracks[index] = { ...oldTrack, ...updateTrackDto };
    return Database.Tracks[index];
  }

  remove(id: string) {
    if (!validate(id)) {
      console.log(`id '${id}' is invalid`);
      throw new BadRequestException();
    }
    const index = Database.Tracks.findIndex((track) => {
      return track.id === id;
    });
    if (index === -1) {
      console.log(`remove: track with id '${id}' not found`);
      throw new NotFoundException();
    }

    const indexInFavorites = Database.Favorites.tracks.indexOf(id);
    if (index >= 0) Database.Favorites.tracks.splice(indexInFavorites, 1);

    Database.Tracks.splice(index, 1);
    console.log(`remove: track with id '${id}' was deleted`);
  }

  removeArtistLink(id: string) {
    console.log(`isn't implemented yet`);
  }
}
