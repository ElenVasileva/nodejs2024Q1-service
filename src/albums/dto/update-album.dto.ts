import { IsInt, IsString } from 'class-validator';

export class UpdateAlbumDto {
  @IsString()
  name: string;
  @IsInt()
  year: number;
  artistId: string | null;
}
