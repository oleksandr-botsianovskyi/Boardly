import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBoardDto } from './dto/create-board.dto.js';

@Injectable()
export class BoardService {
  constructor(private readonly prisma: PrismaService) {}

  async create(ownerId: string, dto: CreateBoardDto) {
    return this.prisma.orm.Board.create({
      title: dto.title,
      ownerId,
    });
  }

  async findAll(ownerId: string) {
    return this.prisma.orm.Board.where({ ownerId }).all();
  }
}
