import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import {
  RegisterAccount,
  RegisterAccountSchema,
} from '@src/auth/register-account/register.schema';
import { Role } from '@src/auth/role/role.enum';
import { DATABASE_CLIENT } from '@src/db/database.provider';
import { DB } from '@src/db/db';
import { ACCOUNT_TABLE } from '@src/db/migrations/1736545777733_create-account-table';
import {
  ACCOUNT_ROLE_TABLE,
  ROLE_TABLE,
} from '@src/db/migrations/1736577567069_create-role-and-account-role-table';
import { ZodCustomError } from '@src/exception/zod.error';
import { generateRandomString } from '@src/util/random-string';

import * as bcrypt from 'bcrypt';
import { Kysely } from 'kysely';

@Injectable()
export class RegisterService {
  constructor(@Inject(DATABASE_CLIENT) private readonly db: Kysely<DB>) {}

  async register(dto: RegisterAccount) {
    const result = RegisterAccountSchema.safeParse(dto);
    if (!result.success) {
      throw new ZodCustomError({ errors: result.error.errors });
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(
      result.data.password,
      saltOrRounds,
    );

    return await this.db.transaction().execute(async (trx) => {
      // check if all roles are valid and retrieve its id and name
      const roles = await trx
        .selectFrom(ROLE_TABLE)
        .select(['role.id', 'role.name'])
        .where('role.name', 'in', [Role.User])
        .execute();

      if (!roles || roles.length === 0) {
        throw new BadRequestException('User role not found');
      }

      // create account
      const account = await trx
        .insertInto(ACCOUNT_TABLE)
        .values({
          first_name: result.data.firstName,
          last_name: result.data.lastName,
          username: generateRandomString(),
          email: result.data.email,
          hashed_password: hashedPassword,
          phone_number: result.data.phoneNumber,
        })
        .returning(['account.id'])
        .executeTakeFirst();

      // associate account_id with role_id
      const associateRoles = roles.map((role) => ({
        account_id: account!.id,
        role_id: role.id,
      }));
      await trx.insertInto(ACCOUNT_ROLE_TABLE).values(associateRoles).execute();

      return account;
    });
  }
}
