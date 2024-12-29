import { ApiProperty } from '@nestjs/swagger';

export class CreateAppDto {
  @ApiProperty({
    description: 'Name of the app',
    type: String,
    example: 'John',
  })
  name: string;

  @ApiProperty({
    description: 'Email of the app',
    type: String,
    example: 'john@test.com',
  })
  email: string;
}
