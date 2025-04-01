import { Duty } from '../types/duties';

import config from '../config.json';

export const fetchDuties = async (): Promise<Duty[]> => {
  const res = await fetch(`${config.API_URL}/duties`);
  if (!res.ok) throw new Error('Failed to fetch duties');
  return res.json();
};

export const createDuty = async (name: string): Promise<Duty> => {
  const res = await fetch(`${config.API_URL}/duties`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error('Failed to create duty');
  return res.json();
};

export const updateDuty = async (id: string, name: string): Promise<boolean> => {
  const res = await fetch(`${config.API_URL}/duties/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error('Failed to update duty');
  return true;
};
