import { Controller, Get } from '@nestjs/common';
import { DbService } from './db.service';

// Dùng sau mỗi lần deploy để kiểm tra: đúng môi trường? đúng version? có kết nối được DB không?
@Controller('health')
export class HealthController {
  constructor(private readonly db: DbService) {}

  @Get()
  async check() {
    let db = 'ok';
    try {
      await this.db.query('SELECT 1');
    } catch {
      db = 'error';
    }
    return {
      status: db === 'ok' ? 'ok' : 'degraded',
      env: process.env.APP_ENV ?? 'local',
      version: process.env.APP_VERSION ?? 'dev',
      db,
    };
  }
}
