import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor() {}

  // Validate username and password
  async validateUser(username: string, password: string): Promise<any | null> {
    // const user = await this.userRepository.findOne({ where: { username } });

    // if (user && (await bcrypt.compare(password, user.password))) {
    //   return user;
    // }
    // return null;

    return { userID: 1 };
  }

  // Create session token logic (optional)
  async createSessionToken(user: any) {
    // You can also create a JWT token here, or just rely on session.
    return user;
  }
}
