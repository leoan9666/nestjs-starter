import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export const LOCAL_STRATEGY = 'local';

@Injectable()
export class LocalAuthGuard extends AuthGuard(LOCAL_STRATEGY) {}
