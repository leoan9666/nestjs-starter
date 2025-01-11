/**
 * This file was generated by kysely-codegen.
 * Please do not edit it manually.
 */

import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Int8 = ColumnType<string, bigint | number | string, bigint | number | string>;

export type Status = "active" | "inactive" | "suspended";

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Account {
  created_at: Generated<Timestamp>;
  email: string;
  email_verified: Generated<boolean>;
  first_name: string;
  hashed_password: string;
  id: Generated<Int8>;
  last_login: Timestamp | null;
  last_name: string;
  phone_number: string | null;
  profile_pic_url: string | null;
  status: Generated<Status>;
  updated_at: Generated<Timestamp>;
  username: string;
}

export interface AccountRole {
  account_id: Int8;
  role_id: Int8;
}

export interface Role {
  created_at: Generated<Timestamp>;
  id: Generated<Int8>;
  name: string;
  updated_at: Generated<Timestamp>;
}

export interface DB {
  account: Account;
  account_role: AccountRole;
  role: Role;
}
