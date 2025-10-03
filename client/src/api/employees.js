const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  const hasJson = contentType && contentType.includes('application/json');
  const data = hasJson ? await response.json() : null;

  if (!response.ok) {
    const error = (data && data.error) || (data && data.errors) || response.statusText;
    throw { status: response.status, message: error, data };
  }

  return data;
};

export const getEmployees = async ({ name, page, limit } = {}) => {
  const params = new URLSearchParams();
  if (name) params.append('name', name);
  if (page) params.append('page', page);
  if (limit) params.append('limit', limit);

  const url = `${API_BASE_URL}/employees${params.toString() ? '?' + params.toString() : ''}`;
  const response = await fetch(url);
  return handleResponse(response);
};

export const getEmployee = async (id) => {
  const response = await fetch(`${API_BASE_URL}/employees/${id}`);
  return handleResponse(response);
};

export const createEmployee = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/employees`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

export const updateEmployee = async (id, payload) => {
  const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
};

export const deleteEmployee = async (id) => {
  const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    const hasJson = contentType && contentType.includes('application/json');
    const data = hasJson ? await response.json() : null;
    const error = (data && data.error) || response.statusText;
    throw { status: response.status, message: error, data };
  }
  
  return true;
};
