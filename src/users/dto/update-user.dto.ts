import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto, UserStatus } from './create-user.dto';
import { IsEnum, IsOptional } from '@nestjs/class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
