#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/2f3280a157cd29dc4643d6ecea8eab7ecaddedbb198f077a89d1ecd57b19366b/contract';
import endContract from '../../snapshots/2f3280a157cd29dc4643d6ecea8eab7ecaddedbb198f077a89d1ecd57b19366b/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/38b5809db5a001b468f0d6ab15895fb8334e7edc98b6f64539c7ef49dc9398e2/contract';
import startContract from '../../snapshots/38b5809db5a001b468f0d6ab15895fb8334e7edc98b6f64539c7ef49dc9398e2/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'Task',
        columns: [
          col('assigneeId', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('createdById', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'uuid', { notNull: true, codecRef: { codecId: 'pg/uuid@1' } }),
          col('reviewerId', 'uuid', { codecRef: { codecId: 'pg/uuid@1' } }),
          col('title', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Task',
        index: 'Task_assigneeId_idx_fd12ae38',
        columns: ['assigneeId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Task',
        index: 'Task_createdById_idx_8bf640ed',
        columns: ['createdById'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'Task',
        index: 'Task_reviewerId_idx_25a27b4e',
        columns: ['reviewerId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Task',
        foreignKey: {
          name: 'Task_createdById_fkey',
          columns: ['createdById'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Task',
        foreignKey: {
          name: 'Task_reviewerId_fkey',
          columns: ['reviewerId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Task',
        foreignKey: {
          name: 'Task_assigneeId_fkey',
          columns: ['assigneeId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
