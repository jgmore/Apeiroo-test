import { DutiesService } from '../src/services/dutiesService';
import { pool } from '../src/db';

jest.mock('../src/db', () => ({
  pool: {
    query: jest.fn()
  }
}));

describe('DutiesService', () => {
  const service = new DutiesService();

  it('should get all duties', async () => {
    (pool.query as jest.Mock).mockResolvedValue({ rows: [{ id: '1', name: 'Test' }] });
    const duties = await service.getAll();
    expect(duties).toEqual([{ id: '1', name: 'Test' }]);
  });

  it('should create a duty', async () => {
    (pool.query as jest.Mock).mockResolvedValue({ rows: [{ id: '1', name: 'New Duty' }] });
    const duty = await service.create('New Duty');
    expect(duty).toEqual({ id: '1', name: 'New Duty' });
  });

  it('should update a duty', async () => {
    (pool.query as jest.Mock).mockResolvedValue({ rowCount: 1 });
    const success = await service.update('1', 'Updated Name');
    expect(success).toBe(true);
  });
});