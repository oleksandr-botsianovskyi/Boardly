import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { BoardService } from './board.service.js';
import { CreateBoardDto } from './dto/create-board.dto.js';
import type { AuthenticatedRequest } from '../auth/types/authenticated-request.js';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.boardService.findAll(req.user.id);
  }

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateBoardDto) {
    return this.boardService.create(req.user.id, dto);
  }
}
