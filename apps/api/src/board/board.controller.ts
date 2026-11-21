import { Controller } from '@nestjs/common';
import { BoardService } from './board.service.js';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}
}
