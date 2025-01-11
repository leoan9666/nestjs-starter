import { Role } from '@src/auth/role/role.enum';
import { ROLE_TABLE } from '@src/db/migrations/1736577567069_create-role-and-account-role-table';

import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Insert default roles: 'admin' and 'user' into the role table
  await db
    .insertInto(ROLE_TABLE)
    .values([{ name: Role.Admin }, { name: Role.User }])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Remove the default roles 'admin' and 'user' from the role table
  await db.deleteFrom('role').where('name', 'in', ['admin', 'user']).execute();
}
