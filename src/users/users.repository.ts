import { Injectable } from '@nestjs/common';
import { RowDataPacket } from 'mysql2/promise';
import { BaseRepository } from 'src/common/base.repository';
import { mapSpError } from 'src/common/sp-error.mapper';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersRepository extends BaseRepository {
  async getUsers(page: number, limit: number) {
    try {
      const sets = await this.call('sp_users_find_all', [page, limit]);
      const rows = sets[0] as RowDataPacket[] | undefined;
      const total =
        ((sets[1]?.[0] as RowDataPacket | undefined)?.total as number) ?? 0;
      return { rows, total };
    } catch (e) {
      mapSpError(e);
    }
  }

  async getUserById(id: number) {
    try {
      const sets = await this.call('sp_users_find_by_id', [id]);
      return (sets[0]?.[0] as RowDataPacket | undefined) ?? null;
    } catch (e) {
      mapSpError(e);
    }
  }

  async getUserByEmail(email: string) {
    try {
      const sets = await this.call('sp_users_find_by_email', [email]);
      return (sets[0]?.[0] as RowDataPacket | undefined) ?? null;
    } catch (e) {
      mapSpError(e);
    }
  }

  async createUser(dto: CreateUserDto, passwordHash: string) {
    try {
      const sets = await this.call('sp_users_create', [
        dto.name,
        dto.email,
        passwordHash,
        dto.role ?? 'customer',
      ]);
      return sets[0]?.[0];
    } catch (e) {
      mapSpError(e);
    }
  }

  async updateUser(id: number, dto: UpdateUserDto) {
    try {
      const sets = await this.call('sp_users_update', [
        id,
        dto.name ?? null,
        dto.role ?? null,
        dto.status ?? null,
      ]);
      return sets[0]?.[0] as RowDataPacket | undefined;
    } catch (e) {
      mapSpError(e);
    }
  }

  async deleteUser(id: number) {
    try {
      await this.call('sp_users_delete', [id]);
    } catch (e) {
      mapSpError(e);
    }
  }
}
