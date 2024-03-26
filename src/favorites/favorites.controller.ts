import { Controller, Get, Post, Param, Delete, HttpStatus, HttpCode, ParseUUIDPipe } from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':entityType/:id')
  @HttpCode(HttpStatus.CREATED)
  async create(@Param('entityType') entityType: string, @Param('id', ParseUUIDPipe) id: string) {
    return await this.favoritesService.create(entityType, id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.favoritesService.findAll();
  }

  @Delete(':entityType/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('entityType') entityType: string, @Param('id', ParseUUIDPipe) id: string) {
    return await this.favoritesService.remove(entityType, id);
  }
}
