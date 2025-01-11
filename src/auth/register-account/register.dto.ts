import { ApiProperty } from '@nestjs/swagger';

export class RegisterAccountDto {
  @ApiProperty({
    description: 'First name of the user',
    type: String,
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user',
    type: String,
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'Email address of the user',
    type: String,
    example: 'john.doe@test.com',
  })
  email: string;

  @ApiProperty({
    description: 'Password for the user account',
    type: String,
    example: 'SecurePassword123!',
  })
  password: string;

  @ApiProperty({
    description: 'Phone number of the user',
    type: String,
    example: '+1234567890',
  })
  phoneNumber: string;

  // @ApiProperty({
  //   description: 'Roles assigned to the user',
  //   type: [String], // Array of strings
  //   example: ['admin', 'user'],
  // })
  // roles: string[];
}
