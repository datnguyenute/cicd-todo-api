import { Injectable, NotFoundException } from '@nestjs/common';
import { DbService } from '../db.service';

export interface Todo {
  id: number;
  title: string;
  done: boolean;
  created_at: string;
}

@Injectable()
export class TodosService {
  constructor(private readonly db: DbService) {}

  list() {
    return this.db.query<Todo>('SELECT * FROM todos ORDER BY id DESC');
  }

  async create(title: string) {
    const [todo] = await this.db.query<Todo>('INSERT INTO todos (title) VALUES ($1) RETURNING *', [title]);
    return todo;
  }

  async toggle(id: number) {
    const [todo] = await this.db.query<Todo>('UPDATE todos SET done = true WHERE id = $1 RETURNING *', [id]);
    if (!todo) throw new NotFoundException(`Todo ${id} not found`);
    return todo;
  }
}
