import { Duty } from '../types/duties';

import config from '../config.json';

export const fetchDuties = async (): Promise<Duty[]> => {
  const res = await fetch(`${config.API_URL}/duties`);
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
};

export const createDuty = async (name: string): Promise<Duty> => {
  const res = await fetch(`${config.API_URL}/duties`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
};

export const updateDuty = async (id: string, name: string, version: Date): Promise<boolean> => {
  const res = await fetch(`${config.API_URL}/duties/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, version }),
  });
  if (!res.ok) throw new Error(res.statusText);
  return true;
};

export const deleteDuty = async (id: string, version : Date): Promise<boolean> => {
  const res = await fetch(`${config.API_URL}/duties/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ version }),
  });
  console.log(res);
  if (!res.ok) throw new Error(res.statusText);
  return true;
};