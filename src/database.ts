import { Album } from './albums/entities/album.entity';
import { Artist } from './artists/entities/artist.entity';
import { Favorites } from './favorites/entities/favorite.entity';
import { Track } from './tracks/entities/track.entity';
import { User } from './users/entities/user.entity';

export class Database {
  public static Albums: Album[] = [];
  public static Artists: Artist[] = [];
  public static Tracks: Track[] = [];
  public static Users: User[] = [];
  public static Favorites: Favorites = {
    artists: [],
    albums: [],
    tracks: [],
  };
}
