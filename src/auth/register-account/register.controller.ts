import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ZodValidationPipe } from '@src/app.pipe';
import { RegisterAccountDto } from '@src/auth/register-account/register.dto';
import {
  RegisterAccount,
  RegisterAccountSchema,
} from '@src/auth/register-account/register.schema';
import { RegisterService } from '@src/auth/register-account/register.service';
import { PublicRoute } from '@src/auth/set-public.metadata';

@ApiBearerAuth()
@ApiTags('Register')
@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @PublicRoute()
  @Post()
  @ApiOperation({
    summary: 'Registers a new account',
    description:
      'This endpoint registers a new user account by accepting required user details such as username, email, and password.',
  })
  @ApiResponse({
    status: 200,
    description: 'Account successfully registered.',
    type: String,
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request. The request is malformed or missing required parameters.',
  })
  @ApiBody({ type: RegisterAccountDto })
  @UsePipes(new ZodValidationPipe(RegisterAccountSchema))
  async register(@Body() registerAccountDto: RegisterAccount): Promise<any> {
    return this.registerService.register(registerAccountDto);
  }
}
