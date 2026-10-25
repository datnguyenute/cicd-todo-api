import { BadRequestException, Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private readonly todos: TodosService) {}

  @Get()
  list() {
    return this.todos.list();
  }

  @Post()
  create(@Body() body: { title?: string }) {
    const title = body.title?.trim();
    if (!title) throw new BadRequestException('title is required');
    return this.todos.create(title);
  }

  @Patch(':id/toggle')
  toggle(@Param('id', ParseIntPipe) id: number) {
    return this.todos.toggle(id);
  }

  @Patch(':id/important')
  toggleImportant(@Param('id', ParseIntPipe) id: number) {
    return this.todos.toggleImportant(id);
  }
}
