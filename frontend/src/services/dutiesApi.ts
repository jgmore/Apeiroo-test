import { Duty } from '../types/duties';

import config from '../config.json';

export const fetchDuties = async (): Promise<Duty[]> => {
  const res = await fetch(`${config.API_URL}/duties`);
  if (!res.ok){
    let data;
    try {
      data = await res.json(); // Try parsing JSON
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      console.error("Raw response text:", await res.text()); // Log raw response for debugging
      throw new Error("Invalid response from server");
    }
    throw new Error(data?.error || 'Failed to fetch duties');
  }
  return res.json();
};

export const createDuty = async (name: string): Promise<Duty> => {
  const res = await fetch(`${config.API_URL}/duties`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok){
    let data;
    try {
      data = await res.json(); // Try parsing JSON
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      console.error("Raw response text:", await res.text()); // Log raw response for debugging
      throw new Error("Invalid response from server");
    }
    throw new Error(data?.error || 'Failed to create duty');
  }
  return res.json();
};

export const updateDuty = async (id: string, name: string, version: Date): Promise<boolean> => {
  const res = await fetch(`${config.API_URL}/duties/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, version }),
  });

  if (!res.ok){
    let data;
    try {
      data = await res.json(); // Try parsing JSON
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      console.error("Raw response text:", await res.text()); // Log raw response for debugging
      throw new Error("Invalid response from server");
    }
    throw new Error(data?.error || 'Failed to update duty');
  }
  return true;
};

export const deleteDuty = async (id: string, version : Date): Promise<boolean> => {
  const res = await fetch(`${config.API_URL}/duties/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ version }),
  });
  if (!res.ok){
    let data;
    try {
      data = await res.json(); // Try parsing JSON
    } catch (error) {
      console.error("Failed to parse JSON:", error);
      console.error("Raw response text:", await res.text()); // Log raw response for debugging
      throw new Error("Invalid response from server");
    }
    throw new Error(data?.error || 'Failed to delete duty');
  }
  return true;
};