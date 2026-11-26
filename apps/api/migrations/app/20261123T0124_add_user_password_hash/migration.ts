#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/3db505b5e5ed137c25782f0039c929869c99a1c7b04f28241e3be37cdb42e760/contract';
import endContract from '../../snapshots/3db505b5e5ed137c25782f0039c929869c99a1c7b04f28241e3be37cdb42e760/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/8d2e05ef18d97ad127efed44a464c1ba6af80fa64be56b3532a8f9f2a2e52391/contract';
import startContract from '../../snapshots/8d2e05ef18d97ad127efed44a464c1ba6af80fa64be56b3532a8f9f2a2e52391/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'User',
        column: col('passwordHash', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
