import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateArtistDto {
  @IsString()
  name: string;
  @IsBoolean()
  grammy: boolean;
}
