const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function buildAuthHeader() {
  const token = getAccessToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.auth ? buildAuthHeader() : {}),
      ...(options.headers || {})
    },
    ...options
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = data?.detail || 'Something went wrong. Please try again.';
    throw new Error(message);
  }

  return data;
}

export async function signup({ email, password }) {
  return request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export async function login({ email, password }) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export function storeTokens(accessToken, refreshToken) {
  localStorage.setItem('selenly_token', accessToken);
  localStorage.setItem('selenly_refresh', refreshToken);
}

export function getAccessToken() {
  return localStorage.getItem('selenly_token');
}

export function getRefreshToken() {
  return localStorage.getItem('selenly_refresh');
}

export function clearTokens() {
  localStorage.removeItem('selenly_token');
  localStorage.removeItem('selenly_refresh');
}

export async function listPosts() {
  return request('/posts');
}

export async function createPost(payload) {
  return request('/posts', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload)
  });
}

export async function updatePost(id, payload) {
  return request(`/posts/${id}`, {
    method: 'PUT',
    auth: true,
    body: JSON.stringify(payload)
  });
}

export async function deletePost(id) {
  return request(`/posts/${id}`, {
    method: 'DELETE',
    auth: true
  });
}

export async function listMoods() {
  return request('/moods', { auth: true });
}

export async function createMood(payload) {
  return request('/moods', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload)
  });
}

export async function updateMood(id, payload) {
  return request(`/moods/${id}`, {
    method: 'PUT',
    auth: true,
    body: JSON.stringify(payload)
  });
}

export async function deleteMood(id) {
  return request(`/moods/${id}`, {
    method: 'DELETE',
    auth: true
  });
}

export async function listJournals() {
  return request('/journals', { auth: true });
}

export async function createJournal(payload) {
  return request('/journals', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload)
  });
}

export async function updateJournal(id, payload) {
  return request(`/journals/${id}`, {
    method: 'PUT',
    auth: true,
    body: JSON.stringify(payload)
  });
}

export async function deleteJournal(id) {
  return request(`/journals/${id}`, {
    method: 'DELETE',
    auth: true
  });
}

export async function createReport(payload) {
  return request('/reports', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload)
  });
}

export async function listReports() {
  return request('/reports', { auth: true });
}

export async function updateReportStatus(id, status) {
  return request(`/reports/${id}/status?status=${encodeURIComponent(status)}`, {
    method: 'PUT',
    auth: true
  });
}
