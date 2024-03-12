import { BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Database } from 'src/database';
import { validate } from 'uuid';

@Injectable()
export class FavoritesService {
  private getDbDataByType(entityType: string) {
    switch (entityType) {
      case 'artist':
        return {
          existingIds: Database.Artists.map((artist) => {
            return artist.id;
          }),
          favoriteIds: Database.Favorites.artists,
        };
      case 'album':
        return {
          existingIds: Database.Albums.map((album) => {
            return album.id;
          }),
          favoriteIds: Database.Favorites.albums,
        };
      case 'track':
        return {
          existingIds: Database.Tracks.map((track) => {
            return track.id;
          }),
          favoriteIds: Database.Favorites.tracks,
        };
    }
  }

  create(entityType: string, id: string) {
    if (!validate(id)) {
      console.log(`add favorite: id '${id}' is invalid`);
      throw new BadRequestException();
    }
    const { existingIds: existingIds, favoriteIds } = this.getDbDataByType(entityType);
    if (existingIds.indexOf(id) === -1) throw new UnprocessableEntityException();
    favoriteIds.push(id);
    console.log(`add favorite: ${entityType} with id '${id}' has added`);
  }

  findAll() {
    const favoriteIds = Database.Favorites;
    const artists = favoriteIds.artists.map((id) => {
      return Database.Artists.find((artist) => {
        return artist.id === id;
      });
    });
    const albums = favoriteIds.albums.map((id) => {
      return Database.Albums.find((album) => {
        return album.id === id;
      });
    });
    const tracks = favoriteIds.tracks.map((id) => {
      return Database.Tracks.find((track) => {
        return track.id === id;
      });
    });
    console.log('get all faforites');
    return { artists, albums, tracks };
  }

  remove(entityType: string, id: string) {
    console.log(`remove favorite: ${entityType} with id '${id}'`);
    if (!validate(id)) {
      console.log(`remove favorite: id '${id}' is invalid`);
      throw new BadRequestException();
    }
    const { existingIds: existingIds, favoriteIds } = this.getDbDataByType(entityType);
    if (existingIds.indexOf(id) === -1) throw new UnprocessableEntityException();

    const index = favoriteIds.indexOf(id);
    if (index >= 0) favoriteIds.splice(index, 1);
    console.log(`remove favorite: ${entityType} with id '${id}' has removed`);
  }
}
