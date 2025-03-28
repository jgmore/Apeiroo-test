import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddDutyForm from './AddDutyForm';

global.fetch = jest.fn();

describe('AddDutyForm', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('renders input and buttons', () => {
    render(<AddDutyForm onAddSuccess={jest.fn()} />);
    expect(screen.getByPlaceholderText(/enter new duty/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
  });

  it('calls onAddSuccess when Refresh is clicked', () => {
    const mockOnAdd = jest.fn();
    render(<AddDutyForm onAddSuccess={mockOnAdd} />);
    fireEvent.click(screen.getByRole('button', { name: /refresh/i }));
    expect(mockOnAdd).toHaveBeenCalled();
  });

  it('sends POST request when Add is clicked', async () => {
    const mockOnAdd = jest.fn();
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    render(<AddDutyForm onAddSuccess={mockOnAdd} />);
    fireEvent.change(screen.getByPlaceholderText(/enter new duty/i), {
      target: { value: 'Test Task' },
    });
    fireEvent.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/\/duties$/), expect.objectContaining({
        method: 'POST',
      }));
      expect(mockOnAdd).toHaveBeenCalled();
    });
  });
});
