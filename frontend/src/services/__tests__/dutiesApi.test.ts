import { fetchDuties, createDuty, updateDuty } from '../dutiesApi';
import config from '../../config.json';

global.fetch = jest.fn();

describe('dutiesApi Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('fetches duties successfully', async () => {
        const mockDuties = [
            { id: '1', name: 'Test Duty 1', completed: false },
            { id: '2', name: 'Test Duty 2', completed: true },
        ];
        (fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue(mockDuties),
        });

        const result = await fetchDuties();
        expect(fetch).toHaveBeenCalledWith(`${config.API_URL}/duties`);
        expect(result).toEqual(mockDuties);
    });

    it('handles fetch duties failure', async () => {
        (fetch as jest.Mock).mockResolvedValue({ ok: false });
        await expect(fetchDuties()).rejects.toThrow('Failed to fetch duties');
    });

    it('creates a new duty successfully', async () => {
        const newDuty = { id: '3', name: 'New Duty' };
        (fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue(newDuty),
        });

        const result = await createDuty('New Duty');
        expect(fetch).toHaveBeenCalledWith(`${config.API_URL}/duties`, expect.objectContaining({ method: 'POST' }));
        expect(result).toEqual(newDuty);
    });

    it('handles create duty failure', async () => {
        (fetch as jest.Mock).mockResolvedValue({ ok: false });
        await expect(createDuty('Fail Duty')).rejects.toThrow('Failed to create duty');
    });

    it('updates a duty successfully', async () => {
        (fetch as jest.Mock).mockResolvedValue({ ok: true });

        await updateDuty('1', 'Updated Duty');
        expect(fetch).toHaveBeenCalledWith(`${config.API_URL}/duties/1`, expect.objectContaining({ method: 'PUT' }));
    });

    it('handles update duty failure', async () => {
        (fetch as jest.Mock).mockResolvedValue({ ok: false });
        await expect(updateDuty('1', 'Updated Duty')).rejects.toThrow('Failed to update duty');
    });

});
