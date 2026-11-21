#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/04c3de3f5c065b8bfcf415183c28bc2d2aa634a1fa668ec915ae8b1c376d276a/contract';
import startContract from '../../snapshots/04c3de3f5c065b8bfcf415183c28bc2d2aa634a1fa668ec915ae8b1c376d276a/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/8d2e05ef18d97ad127efed44a464c1ba6af80fa64be56b3532a8f9f2a2e52391/contract';
import endContract from '../../snapshots/8d2e05ef18d97ad127efed44a464c1ba6af80fa64be56b3532a8f9f2a2e52391/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.dropConstraint({
        schema: 'public',
        table: 'Column',
        constraint: 'Column_boardId_fkey',
        kind: 'foreignKey',
      }),
      this.dropConstraint({
        schema: 'public',
        table: 'Task',
        constraint: 'Task_columnId_fkey',
        kind: 'foreignKey',
      }),
      this.addColumn({
        schema: 'public',
        table: 'Task',
        column: col('position', 'int4', {
          notNull: true,
          default: lit(0),
          codecRef: { codecId: 'pg/int4@1' },
        }),
      }),
      this.createIndex({
        schema: 'public',
        table: 'Task',
        index: 'Task_columnId_position_idx_223f78be',
        columns: ['columnId', 'position'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Column',
        foreignKey: {
          name: 'Column_boardId_fkey',
          columns: ['boardId'],
          references: { schema: 'public', table: 'Board', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Task',
        foreignKey: {
          name: 'Task_columnId_fkey',
          columns: ['columnId'],
          references: { schema: 'public', table: 'Column', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
