import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service.js';

@Injectable()
export class AppService {
  constructor(private readonly prismaService: PrismaService) {}

  getUsers = async () => {
    const users = await this.prismaService.dbClient.orm.public.User.all();
    return users;
  };

  getHello(): string {
    return 'Hello World!';
  }
}
