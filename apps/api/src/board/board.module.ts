import { Module } from '@nestjs/common';
import { BoardService } from './board.service.js';
import { BoardController } from './board.controller.js';

@Module({
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
