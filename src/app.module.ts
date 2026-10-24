import { Module } from '@nestjs/common';
import { DbService } from './db.service';
import { HealthController } from './health.controller';
import { TodosController } from './todos/todos.controller';
import { TodosService } from './todos/todos.service';

@Module({
  controllers: [HealthController, TodosController],
  providers: [DbService, TodosService],
})
export class AppModule {}
