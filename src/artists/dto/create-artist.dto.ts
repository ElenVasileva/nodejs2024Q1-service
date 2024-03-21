import { IsNotEmpty, IsString } from 'class-validator';

export class CreateArtistDto {
  @IsString()
  name: string;
  @IsNotEmpty()
  grammy: boolean;
}
