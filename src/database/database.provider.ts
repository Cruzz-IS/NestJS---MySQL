import { Logger } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

export const DATABASE_POOL = 'DATABASE_POOL';

export const DatabaseProvider = [
  {
    provide: DATABASE_POOL,
    useFactory: async (): Promise<mysql.Pool> => {
      const pool = mysql.createPool({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        connectionLimit: 10,
        timezone: 'Z',
      });

      const connection = await pool.getConnection();
      new Logger('Database').log(' El pool de MySQL esta conectado');
      connection.release();

      return pool;
    },
  },
];
