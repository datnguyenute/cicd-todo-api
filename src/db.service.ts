import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Pool, QueryResultRow } from 'pg';

// Không dùng ORM: viết SQL thẳng để thấy rõ app nói chuyện với Postgres thế nào
@Injectable()
export class DbService implements OnModuleDestroy {
  // Pool = giữ sẵn vài kết nối tới Postgres để tái sử dụng cho nhiều request
  private readonly pool = new Pool({ connectionString: process.env.DATABASE_URL });

  async query<T extends QueryResultRow>(sql: string, params: unknown[] = []): Promise<T[]> {
    const result = await this.pool.query<T>(sql, params);
    return result.rows;
  }

  onModuleDestroy() {
    return this.pool.end();
  }
}
