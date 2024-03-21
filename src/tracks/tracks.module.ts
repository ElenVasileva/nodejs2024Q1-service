import { Module } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [TracksController],
  providers: [TracksService, PrismaClient],
  exports: [TracksService],
})
export class TracksModule {}
