
import { v4 as uuidv4, validate } from 'uuid';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';

@Injectable()
export class TracksService {
  private readonly tracks: Track[] = [];
  create(createTrackDto: CreateTrackDto) {
    if (!createTrackDto.name || (!createTrackDto.duration && createTrackDto.duration !== 0)) {
      console.log(`name '${createTrackDto.name}' or duration '${createTrackDto.duration}' is incorrect`);
      throw new BadRequestException();
    }
    const newTrack = {
      id: uuidv4(),
      ...createTrackDto,
    };
    this.tracks.push(newTrack);
    console.log(`track '${newTrack.name}' with id '${newTrack.id}' was created`);
    return newTrack;
  }

  findAll() {
    return this.tracks;
  }

  findOne(id: string) {
    if (!validate(id)) {
      console.log(`findOne: id '${id}' is invalid`);
      throw new BadRequestException();
    }
    const index = this.tracks.findIndex((track) => {
      return track.id === id;
    });
    if (index === -1) {
      console.log(`findOne: track with id '${id}' not found`);
      throw new NotFoundException();
    }
    return this.tracks[index];
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
    const index = this.tracks.findIndex((track) => {
      return track.id === id;
    });
    if (index === -1) {
      console.log(`update: track with id '${id}' not found`);
      throw new NotFoundException();
    }
    const oldTrack = this.tracks[index];
    this.tracks[index] = { ...oldTrack, ...updateTrackDto };
    return this.tracks[index];
  }

  remove(id: string) {
    if (!validate(id)) {
      console.log(`id '${id}' is invalid`);
      throw new BadRequestException();
    }
    const index = this.tracks.findIndex((track) => {
      return track.id === id;
    });
    if (index === -1) {
      console.log(`remove: track with id '${id}' not found`);
      throw new NotFoundException();
    }
    console.log(`remove: track with id '${id}' was deleted`);
    this.tracks.splice(index, 1);
  }
}
