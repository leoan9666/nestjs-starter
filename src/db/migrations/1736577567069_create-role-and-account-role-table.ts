import { ACCOUNT_TABLE } from '@src/db/migrations/1736545777733_create-account-table';
import { Kysely, sql } from 'kysely';

export const ROLE_TABLE = 'role';
export const ACCOUNT_ROLE_TABLE = 'account_role';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable(ROLE_TABLE)
    .addColumn('id', 'bigserial', (col) => col.primaryKey())
    .addColumn('name', 'varchar(200)', (col) => col.notNull().unique())
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();

  await db.schema
    .createTable(ACCOUNT_ROLE_TABLE)
    .addColumn('account_id', 'bigint', (col) => col.notNull())
    .addColumn('role_id', 'bigint', (col) => col.notNull())
    .addPrimaryKeyConstraint('account_roles_pk', ['account_id', 'role_id'])
    .addForeignKeyConstraint(
      'fk_account_id',
      ['account_id'],
      ACCOUNT_TABLE,
      ['id'],
      (col) => col.onDelete('cascade'),
    )
    .addForeignKeyConstraint(
      'fk_role_id',
      ['role_id'],
      ROLE_TABLE,
      ['id'],
      (col) => col.onDelete('cascade'),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable(ACCOUNT_ROLE_TABLE).execute();
  await db.schema.dropTable(ROLE_TABLE).execute();
}
