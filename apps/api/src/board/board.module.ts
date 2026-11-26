import { Module } from '@nestjs/common';
import { BoardService } from './board.service.js';
import { BoardController } from './board.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  controllers: [BoardController],
  providers: [BoardService],
  imports: [PrismaModule],
})
export class BoardModule {}
