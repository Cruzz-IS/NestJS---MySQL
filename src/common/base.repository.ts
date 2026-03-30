import { Inject } from '@nestjs/common';
import * as promise from 'mysql2/promise';
import { RowDataPacket } from 'mysql2/promise';
import { DATABASE_POOL } from '../database/database.provider';
import mysql from 'mysql2/promise';

export abstract class BaseRepository {
  constructor(@Inject(DATABASE_POOL) protected readonly pool: promise.Pool) {}

  /**
   * MySQL retornara o devolvera un arreglo por cada SELECT en el SP(procedure).
   */
  protected async call<T extends promise.RowDataPacket>(
    procedure: string,
    params: unknown[] = [],
  ): Promise<T[][]> {
    const placeholders = params.map(() => '?').join(', ');
    const sql = `CALL ${procedure}(${placeholders})`;
    const [results] = await this.pool.execute<mysql.QueryResult>(
      sql,
      params as any[],
    );
    return results as T[][];
  }

  /**
   *Aqui se captura la informacion que nos brindan los parametros de salida de los sp.
   */
  protected async callWithOut(
    procedure: string,
    inParams: unknown[],
    outVar: string,
  ): Promise<{ resultSets: promise.RowDataPacket[][]; outValue: unknown }> {
    const inPlaceholders = inParams.map(() => '?').join(', ');
    const sql = `CALL ${procedure}(${inPlaceholders}, @${outVar})`;

    const [results] = await this.pool.execute<mysql.QueryResult>(
      sql,
      inParams as any[],
    );

    const [[row]] = await this.pool.execute<promise.RowDataPacket[]>(
      `SELECT @${outVar} AS value`,
    );

    return {
      resultSets: results as promise.RowDataPacket[][],
      outValue: row.value,
    };
  }
}

export type { RowDataPacket };
