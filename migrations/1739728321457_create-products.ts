import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('products', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    name: { type: 'varchar', notNull: true },
    price: { type: 'smallint', notNull: true },
    description: { type: 'varchar', notNull: false },
    createdAt: { type: 'timestamp', notNull: true, default: pgm.func('current_timestamp') }
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('products');
}
