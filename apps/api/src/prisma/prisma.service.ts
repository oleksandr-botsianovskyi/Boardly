import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import type { PostgresClient } from '@prisma/orm-postgres/runtime';
import { db } from './db.js';
import type { Contract } from './contract.d.js';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  readonly client: PostgresClient<Contract> = db;

  get orm(): PostgresClient<Contract>['orm']['public'] {
    return this.client.orm.public;
  }

  async onModuleInit(): Promise<void> {
    await this.client.connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.close();
  }
}
