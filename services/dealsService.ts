import { Deal, dealsData } from '../data/deals';
import { BACKEND_URL } from '../constants/config';

export async function getDeals(): Promise<Deal[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/deals`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    // Optionally validate/transform data here
    return data;
  } catch (error) {
    // Fallback to static data
    console.warn('Failed to fetch deals from backend, using static data.', error);
    return dealsData;
  }
} 