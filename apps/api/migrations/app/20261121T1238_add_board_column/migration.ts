#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/04c3de3f5c065b8bfcf415183c28bc2d2aa634a1fa668ec915ae8b1c376d276a/contract';
import endContract from '../../snapshots/04c3de3f5c065b8bfcf415183c28bc2d2aa634a1fa668ec915ae8b1c376d276a/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/2f3280a157cd29dc4643d6ecea8eab7ecaddedbb198f077a89d1ecd57b19366b/contract';
import startContract from '../../snapshots/2f3280a157cd29dc4643d6ecea8eab7ecaddedbb198f077a89d1ecd57b19366b/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey, sql } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'Board',
        columns: [
          col('createdAt', 'timestamptz(3)', {
            notNull: true,
            default: fn(sql`now()`),
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('ownerId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz(3)', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'Column',
        columns: [
          col('boardId', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('position', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addColumn({
        schema: 'public',
        table: 'Task',
        column: col('createdAt', 'timestamptz(3)', {
          notNull: true,
          default: fn(sql`now()`),
          codecRef: { codecId: 'pg/timestamptz-date@1', typeParams: { precision: 3 } },
        }),
      }),
      this.addRequiredColumnToEmptyTable({
        schema: 'public',
        table: 'Task',
        column: 'columnId',
        type: 'uuid',
      }),
      this.addColumnWithTemporaryDefault({
        schema: 'public',
        table: 'Task',
        column: 'updatedAt',
        type: 'timestamptz(3)',
        temporaryDefault: sql`'epoch'`,
      }),
      this.createIndex({
        schema: 'public',
        table: 'Board',
        index: 'Board_ownerId_idx_e2d0c1ef',
        columns: ['ownerId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Column',
        index: 'Column_boardId_idx_74a7b59d',
        columns: ['boardId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Task',
        index: 'Task_columnId_idx_728f084b',
        columns: ['columnId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Board',
        foreignKey: {
          name: 'Board_ownerId_fkey',
          columns: ['ownerId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Column',
        foreignKey: {
          name: 'Column_boardId_fkey',
          columns: ['boardId'],
          references: { schema: 'public', table: 'Board', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Task',
        foreignKey: {
          name: 'Task_columnId_fkey',
          columns: ['columnId'],
          references: { schema: 'public', table: 'Column', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
