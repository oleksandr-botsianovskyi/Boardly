import {
  IsEmail,
  MaxLength,
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  @MaxLength(256)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  password: string;
}
