import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class EmployeeCreateDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  department: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsString()
  @IsOptional()
  avatar: string;
}
