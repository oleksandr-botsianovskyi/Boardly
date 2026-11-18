#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/920a87b50729a867e21706dd0fa5c3739e273a84ed89eb2f3525633b2d6ef85c/contract';
import startContract from '../../snapshots/920a87b50729a867e21706dd0fa5c3739e273a84ed89eb2f3525633b2d6ef85c/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/b1a8734d842613d3d915317b86bc81b64860da5e03da7b86bddddebe2b74818e/contract';
import endContract from '../../snapshots/b1a8734d842613d3d915317b86bc81b64860da5e03da7b86bddddebe2b74818e/contract.json' with { type: 'json' };
import { Migration, MigrationCLI } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [this.dropTable({ schema: 'public', table: 'Post' })];
  }
}

MigrationCLI.run(import.meta.url, M);
