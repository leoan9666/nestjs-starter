import { Kysely, sql } from 'kysely';

export const ACCOUNT_TABLE = 'account';

const STATUS = 'status';
const STATUSES = {
  active: 'active',
  inactive: 'inactive',
  suspended: 'suspended',
};

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createType(STATUS)
    .asEnum([STATUSES.active, STATUSES.inactive, STATUSES.suspended])
    .execute();

  await db.schema
    .createTable(ACCOUNT_TABLE)
    .addColumn('id', 'bigserial', (col) => col.primaryKey())
    .addColumn('first_name', 'varchar(250)', (col) => col.notNull())
    .addColumn('last_name', 'varchar(250)', (col) => col.notNull())
    .addColumn('email', 'varchar(250)', (col) => col.notNull().unique())
    .addColumn('username', 'varchar(50)', (col) => col.notNull().unique())
    .addColumn('hashed_password', 'varchar(250)', (col) => col.notNull())
    .addColumn('last_login', 'timestamptz')
    .addColumn('status', sql`status`, (col) =>
      col.defaultTo(STATUSES.active).notNull(),
    )
    .addColumn('email_verified', 'boolean', (col) =>
      col.defaultTo(false).notNull(),
    )
    .addColumn('phone_number', 'varchar(20)')
    .addColumn('profile_pic_url', 'varchar')
    .addColumn('created_at', 'timestamptz', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.defaultTo(sql`now()`).notNull(),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable(ACCOUNT_TABLE).execute();
  await db.schema.dropType(STATUS).execute();
}
