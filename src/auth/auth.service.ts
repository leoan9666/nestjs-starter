import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { DATABASE_CLIENT } from '@src/db/database.provider';
import { DB } from '@src/db/db';
import { ACCOUNT_TABLE } from '@src/db/migrations/1736545777733_create-account-table';
import {
  ACCOUNT_ROLE_TABLE,
  ROLE_TABLE,
} from '@src/db/migrations/1736577567069_create-role-and-account-role-table';

import * as bcrypt from 'bcrypt';
import { Kysely } from 'kysely';

@Injectable()
export class AuthService {
  constructor(@Inject(DATABASE_CLIENT) private readonly db: Kysely<DB>) {}

  async validateAccount(
    username: string,
    password: string,
  ): Promise<any | null> {
    const account = await this.db
      .selectFrom(ACCOUNT_TABLE)
      .leftJoin(ACCOUNT_ROLE_TABLE, 'account_role.account_id', 'account.id')
      .innerJoin(ROLE_TABLE, 'role.id', 'account_role.role_id')
      .select(['account.hashed_password', 'account.id', 'role.name as role'])
      .where((eb) =>
        eb.or([
          eb('account.email', '=', username),
          eb('account.username', '=', username),
        ]),
      )
      .execute();

    if (!account) {
      throw new NotFoundException(`Username: '${username}' not found.`);
    }

    if (!(await bcrypt.compare(password, account[0].hashed_password))) {
      throw new BadRequestException('Invalid credentials');
    }

    const roles = account.map((acc) => acc.role);

    return { sub: account[0].id, roles };
  }

  // Create session token logic (optional)
  async createSessionToken(user: any) {
    // You can also create a JWT token here, or just rely on session.
    return user;
  }
}
