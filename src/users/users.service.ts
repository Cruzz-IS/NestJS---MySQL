import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { PaginationQueryDto } from 'src/common/pagination-query.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly repo: UsersRepository) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const passwordHash: string = await bcrypt.hash(
        createUserDto.password,
        10,
      );
      return await this.repo.createUser(createUserDto, passwordHash);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error desconocido';
      throw new InternalServerErrorException(
        `Error al crear usuario: ${message}`,
      );
    }
  }

  async getUsers(query: PaginationQueryDto) {
    const { rows, total } = await this.repo.getUsers(query.page, query.limit);
    return {
      data: rows,
      meta: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  async getUserById(id: number) {
    const user = await this.repo.getUserById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async updateUser(id: number, dto: UpdateUserDto) {
    return await this.repo.updateUser(id, dto);
  }

  async deleteUser(id: number): Promise<void> {
    await this.repo.deleteUser(id);
  }
}
