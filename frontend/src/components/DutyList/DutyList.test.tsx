import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DutyList from './DutyList';
import { Duty } from '../../App';

global.fetch = jest.fn();

describe('DutyList', () => {
  const sampleDuties: Duty[] = [
    { id: '1', name: 'First Task' },
    { id: '2', name: 'Second Task' },
  ];

  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('renders list of duties', () => {
    render(<DutyList duties={sampleDuties} onUpdate={jest.fn()} />);
    expect(screen.getByText('First Task')).toBeInTheDocument();
    expect(screen.getByText('Second Task')).toBeInTheDocument();
  });

  it('switches to input on edit click', () => {
    render(<DutyList duties={sampleDuties} onUpdate={jest.fn()} />);
    fireEvent.click(screen.getAllByRole('button', { name: '' })[0]); // Edit button
    expect(screen.getByDisplayValue('First Task')).toBeInTheDocument();
  });

  it('calls fetch and onUpdate on save', async () => {
    const mockUpdate = jest.fn();
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

    render(<DutyList duties={sampleDuties} onUpdate={mockUpdate} />);
    fireEvent.click(screen.getAllByRole('button')[0]); // Edit
    const input = screen.getByDisplayValue('First Task');
    fireEvent.change(input, { target: { value: 'Updated Task' } });

    const saveButton = screen.getByRole('button', { name: '' }); // Save icon
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/\/duties\/1$/), expect.objectContaining({
        method: 'PUT',
      }));
      expect(mockUpdate).toHaveBeenCalled();
    });
  });
});
