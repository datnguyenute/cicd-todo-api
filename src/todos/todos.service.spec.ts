import { NotFoundException } from '@nestjs/common';
import { DbService } from '../db.service';
import { TodosService } from './todos.service';

describe('TodosService', () => {
  const db = { query: jest.fn() };
  const service = new TodosService(db as unknown as DbService);

  beforeEach(() => jest.clearAllMocks());

  it('creates a todo with the given title', async () => {
    db.query.mockResolvedValue([{ id: 1, title: 'Học Docker', done: false }]);
    const todo = await service.create('Học Docker');
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO todos'), ['Học Docker']);
    expect(todo.title).toBe('Học Docker');
  });

  it('toggles using NOT done in SQL', async () => {
    db.query.mockResolvedValue([{ id: 1, title: 'x', done: true }]);
    await service.toggle(1);
    expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SET done = NOT done'), [1]);
  });

  it('throws NotFound when toggling a missing todo', async () => {
    db.query.mockResolvedValue([]);
    await expect(service.toggle(999)).rejects.toBeInstanceOf(NotFoundException);
  });
});
