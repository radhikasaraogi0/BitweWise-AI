/**
 * API Service for BiteWise AI
 */

const API_BASE = '/api';

export async function fetchRecommendations(query, location, userId) {
  const res = await fetch(`${API_BASE}/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, location, user_id: userId })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch recommendations');
  }
  return res.json();
}

export async function fetchUserPersonas() {
  const res = await fetch(`${API_BASE}/users/personas`);
  if (!res.ok) throw new Error('Failed to fetch personas');
  return res.json();
}

export async function fetchUserProfile(userId) {
  const res = await fetch(`${API_BASE}/users/${userId}/profile`);
  if (!res.ok) throw new Error('Failed to fetch user profile');
  return res.json();
}

export async function sendUserEvent(userId, eventData) {
  const res = await fetch(`${API_BASE}/users/${userId}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData)
  });
  if (!res.ok) throw new Error('Failed to record user event');
  return res.json();
}

export async function fetchRestaurants() {
  const res = await fetch(`${API_BASE}/restaurants`);
  if (!res.ok) throw new Error('Failed to fetch restaurants');
  return res.json();
}

export async function updateMenuItem(restaurantId, itemId, updateData) {
  const res = await fetch(`${API_BASE}/restaurants/${restaurantId}/items/${itemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData)
  });
  if (!res.ok) throw new Error('Failed to update menu item');
  return res.json();
}

export async function checkBackendHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) return { status: 'offline' };
  return res.json();
}
