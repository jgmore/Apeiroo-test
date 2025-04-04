import { fetchDuties, createDuty, updateDuty, deleteDuty } from '../dutiesApi';
import config from '../../config.json';

global.fetch = jest.fn();

describe('dutiesApi Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    const mockDate : Date = new Date();

    it('fetches duties successfully', async () => {
        const mockDuties = [
            { id: '1', name: 'Test Duty 1', version: mockDate, completed: false },
            { id: '2', name: 'Test Duty 2', version: mockDate, completed: true },
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
        (fetch as jest.Mock).mockResolvedValue({
            ok: false,
            text: jest.fn().mockResolvedValue("Error: Something went wrong"), // Mock text() method
            json: jest.fn().mockRejectedValue(new Error("Invalid JSON")), // Simulate JSON parsing failure
        });

        await expect(fetchDuties()).rejects.toThrow('Invalid response from server');
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
        (fetch as jest.Mock).mockResolvedValue({
            ok: false,
            text: jest.fn().mockResolvedValue("Error: Unable to create duty"), // Mock text() method
            json: jest.fn().mockRejectedValue(new Error("Invalid JSON")), // Simulate JSON parsing failure
        });

        await expect(createDuty('Fail Duty')).rejects.toThrow('Invalid response from server');
    });

    it('updates a duty successfully', async () => {
        (fetch as jest.Mock).mockResolvedValue({ ok: true });

        await updateDuty('1', 'Updated Duty', mockDate);
        expect(fetch).toHaveBeenCalledWith(`${config.API_URL}/duties/1`, expect.objectContaining({ method: 'PUT' }));
    });

    it('handles update duty failure', async () => {
        (fetch as jest.Mock).mockResolvedValue({
            ok: false,
            text: jest.fn().mockResolvedValue("Error: Unable to update duty"), // Mock text() method
            json: jest.fn().mockRejectedValue(new Error("Invalid JSON")), // Simulate JSON parsing failure
        });
        await expect(updateDuty('1', 'Updated Duty', mockDate)).rejects.toThrow('Invalid response from server');
    });

    it('deletes a duty successfully', async () => {
        (fetch as jest.Mock).mockResolvedValue({ ok: true });
        await deleteDuty('1', mockDate);
        expect(fetch).toHaveBeenCalledWith(`${config.API_URL}/duties/1`, expect.objectContaining({ method: 'DELETE' }));
    });

    it('handles delete duty failure', async () => {
        (fetch as jest.Mock).mockResolvedValue({
            ok: false,
            text: jest.fn().mockResolvedValue("Error: Unable to delete duty"), // Mock text() method
            json: jest.fn().mockRejectedValue(new Error("Invalid JSON")), // Simulate JSON parsing failure
        });

        await expect(deleteDuty('1', mockDate)).rejects.toThrow('Invalid response from server');
    });
});
