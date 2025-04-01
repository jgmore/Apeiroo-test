import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import renderWithAntd from '../../testUtils/renderWithAntd';
import AddDutyForm from '../AddDutyForm';
import { createDuty } from '../../services/dutiesApi';

// Mock the API call
jest.mock('../../services/dutiesApi', () => ({
  createDuty: jest.fn(),
}));

//Mock message to suppress errors
jest.mock('antd', () => {
  const antd = jest.requireActual('antd');
  return {
    ...antd,
    message: {
      success: jest.fn(),
      error: jest.fn(),
    },
  };
});

describe('AddDutyForm', () => {
  const mockOnAddSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form inputs and buttons', () => {
    renderWithAntd(<AddDutyForm onAddSuccess={mockOnAddSuccess} />);

    expect(screen.getByPlaceholderText(/new duty/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
  });

  it('calls createDuty on valid submit', async () => {
    (createDuty as jest.Mock).mockResolvedValueOnce({});

    renderWithAntd(<AddDutyForm onAddSuccess={mockOnAddSuccess} />);

    const input = screen.getByPlaceholderText(/new duty/i);
    const addButton = screen.getByRole('button', { name: /add/i });

    fireEvent.change(input, { target: { value: 'New Duty' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(createDuty).toHaveBeenCalledWith('New Duty');
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(mockOnAddSuccess).toHaveBeenCalled();
    });
  });

  it('shows validation message on empty submit', async () => {
    renderWithAntd(<AddDutyForm onAddSuccess={mockOnAddSuccess} />);

    fireEvent.click(screen.getByRole('button', { name: /add/i }));

    await waitFor(() => {
      expect(screen.getByText(/please enter a duty/i)).toBeInTheDocument();
    });
    expect(createDuty).not.toHaveBeenCalled();
  });
});
