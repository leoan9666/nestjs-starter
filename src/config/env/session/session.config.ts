import { registerAs } from '@nestjs/config';

export const SESSION_CONFIG_NAME = 'session';
export type SessionConfig = {
  secret: string;
  resave: boolean;
  saveUnitialized: boolean;
  cookieHttpOnly: boolean;
  cookieSecure: boolean;
  cookieMaxAge: number;
};

const isTrue = (val: string): boolean => {
  if (val === 'true') {
    return true;
  } else if (val === 'false') {
    return false;
  } else {
    throw new Error('Invalid boolean in session config');
  }
};

export default registerAs(
  SESSION_CONFIG_NAME,
  () =>
    ({
      secret: process.env.SESSION_SECRET,
      resave: isTrue(process.env.SESSION_RESAVE!),
      saveUnitialized: isTrue(process.env.SESSION_SAVE_UNINITIALIZED!),
      cookieHttpOnly: isTrue(process.env.SESSION_COOKIE_HTTP_ONLY!),
      cookieSecure: isTrue(process.env.SESSION_COOKIE_SECURE!),
      cookieMaxAge: parseInt(process.env.SESSION_COOKIE_MAX_AGE!, 10),
    }) as SessionConfig,
);
