import type { AuthUser } from './types/auth-user.js';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';
import * as argon2 from 'argon2';
import { LoginDto } from './dto/login.dto.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<AuthUser> {
    const user = await this.prisma.orm.User.where({ email }).first();

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await argon2.verify(user.passwordHash, password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return { id: user.id, email: user.email };
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);

    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwt.signAsync(payload);

    return { accessToken };
  }

  async register(dto: RegisterDto) {
    const passwordHash = await argon2.hash(dto.password);

    const user = await this.prisma.orm.User.create({
      email: dto.email,
      passwordHash,
    });

    return {
      id: user.id,
      email: user.email,
    };
  }
}
