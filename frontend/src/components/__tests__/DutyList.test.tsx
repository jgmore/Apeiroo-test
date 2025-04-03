import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import DutyList from '../DutyList';
import { updateDuty, deleteDuty } from '../../services/dutiesApi';
import { Duty } from '../../types/duties';
import renderWithAntd from '../../testUtils/renderWithAntd';

jest.mock('../../services/dutiesApi');
jest.mock('antd', () => {
  const antd = jest.requireActual('antd');
  const React = require('react');
  return {
    ...antd,
    message: {
      success: jest.fn(),
      error: jest.fn(),
    },
  };
});

const mockUpdateDuty = updateDuty as jest.Mock;
const mockDeleteDuty = deleteDuty as jest.Mock;
const mockMessage = require('antd').message;

describe('DutyList', () => {
  const mockDate : Date = new Date();
  const sampleDuty: Duty = { id: '1', name: 'Sample Duty', version : mockDate };
  const onUpdate = jest.fn();

  const renderComponent = (duties = [sampleDuty]) =>
      renderWithAntd(<DutyList duties={[sampleDuty]} onUpdate={onUpdate} />);

  const startEditMode = () => {
    fireEvent.click(screen.getByLabelText('Edit'));
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders list of duties', () => {
    renderComponent();
    expect(screen.getByText('Sample Duty')).toBeInTheDocument();
  });

  it('clicking edit shows input with prefilled value', () => {
    renderComponent();
    startEditMode();
    expect(screen.getByDisplayValue('Sample Duty')).toBeInTheDocument();
  });

  it('shows validation error for empty name on update', async () => {
    renderComponent();
    startEditMode();
    const input = screen.getByDisplayValue('Sample Duty') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(screen.getByLabelText('Save'));
    expect(await screen.findByText(/Please enter a duty/i)).toBeInTheDocument();
  });

  it('updates valid duty name', async () => {
    mockUpdateDuty.mockResolvedValueOnce({});
    renderComponent();
    startEditMode();
    const input = screen.getByDisplayValue('Sample Duty');
    fireEvent.change(input, { target: { value: 'Updated' } });
    fireEvent.click(screen.getByLabelText('Save'));

    await waitFor(() => {
      expect(mockUpdateDuty).toHaveBeenCalledWith('1', 'Updated', mockDate);
    });
    expect(onUpdate).toHaveBeenCalled();
    expect(mockMessage.success).toHaveBeenCalledWith('Duty updated successfully.');
  });

  it('shows error message if API update fails', async () => {
    mockUpdateDuty.mockRejectedValueOnce(new Error('Update failed'));
    renderComponent();
    startEditMode();
    const input = screen.getByDisplayValue('Sample Duty');
    fireEvent.change(input, { target: { value: 'Fail Name' } });
    fireEvent.click(screen.getByLabelText('Save'));

    await waitFor(() => {
      expect(mockMessage.error).toHaveBeenCalledWith('Failed to update duty: Update failed');
    });
  });

  it('deletes a duty', async () => {
    mockDeleteDuty.mockResolvedValueOnce(true);
    renderComponent();
    startEditMode();
    fireEvent.click(screen.getByLabelText('Delete'));
    await screen.findByText(/Yes/i);
    fireEvent.click(screen.getByText(/Yes/i));
    await waitFor(() => expect(mockDeleteDuty).toHaveBeenCalledWith('1', mockDate));
    expect(onUpdate).toHaveBeenCalled();
  });

  it('shows error if deleteDuty fails', async () => {
    mockDeleteDuty.mockResolvedValueOnce(false);
    renderComponent();
    startEditMode();
    fireEvent.click(screen.getByLabelText('Delete'));
    await screen.findByText(/Yes/i);
    fireEvent.click(screen.getByText(/Yes/i));
    await waitFor(() => expect(mockDeleteDuty).toHaveBeenCalledWith('1',mockDate));
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it('renders nothing when duties list is empty', () => {
    renderWithAntd(<DutyList duties={[]} onUpdate={onUpdate} />);
    expect(screen.getAllByText('No data').length).toBeGreaterThan(1);
  });
});
