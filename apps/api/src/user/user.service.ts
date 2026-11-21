import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.orm.User.all();
  }

  async create(dto: CreateUserDto) {
    return this.prisma.orm.User.create({
      email: dto.email,
      name: dto.name,
      username: dto.username,
    });
  }
}
