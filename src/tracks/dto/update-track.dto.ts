import { IsNotEmpty } from 'class-validator';

export class UpdateTrackDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  duration: number; // integer number

  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
}
