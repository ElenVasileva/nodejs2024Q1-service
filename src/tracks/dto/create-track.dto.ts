import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTrackDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  duration: number; // integer number

  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
}
