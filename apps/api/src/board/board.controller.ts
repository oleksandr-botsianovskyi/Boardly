import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { BoardService } from './board.service.js';
import { CreateBoardDto } from './dto/create-board.dto.js';
import type { AuthenticatedRequest } from '../auth/types/authenticated-request.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@UseGuards(JwtAuthGuard)
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
