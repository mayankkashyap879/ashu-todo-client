// app/lib/api.js
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/todos`;
const API_TIMEOUT = process.env.NEXT_PUBLIC_API_TIMEOUT || 5000;

// Utility function for handling API responses
async function handleResponse(response) {
  if (!response.ok) {
    if (response.status === 404) {
      return [];
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API Error: ${response.status}`);
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

// Utility function for API requests with timeout
async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

export async function getAllTodos(filters = {}) {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const url = `${API_BASE_URL}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetchWithTimeout(url);
    return await handleResponse(response);
  } catch (error) {
    if (process.env.NEXT_PUBLIC_ENABLE_ERROR_LOGGING === 'true') {
      console.error('Error fetching todos:', error);
    }
    return [];
  }
}

export async function addTodo(todo) {
  try {
    const response = await fetchWithTimeout(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: todo.title,
        description: todo.description,
        Status: 'pending',
        priority: todo.priority || 'medium',
        dueDate: todo.dueDate
      }),
    });

    return await handleResponse(response);
  } catch (error) {
    if (process.env.NEXT_PUBLIC_ENABLE_ERROR_LOGGING === 'true') {
      console.error('Error adding todo:', error);
    }
    throw error;
  }
}

export async function updateTodo(id, updates) {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates)
    });

    return await handleResponse(response);
  } catch (error) {
    if (process.env.NEXT_PUBLIC_ENABLE_ERROR_LOGGING === 'true') {
      console.error('Error updating todo:', error);
    }
    throw error;
  }
}

export async function getUpcomingTodos() {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/upcoming`);
    return await handleResponse(response);
  } catch (error) {
    if (process.env.NEXT_PUBLIC_ENABLE_ERROR_LOGGING === 'true') {
      console.error('Error fetching upcoming todos:', error);
    }
    return [];
  }
}

export async function deleteTodo(id) {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    return await handleResponse(response);
  } catch (error) {
    if (process.env.NEXT_PUBLIC_ENABLE_ERROR_LOGGING === 'true') {
      console.error('Error deleting todo:', error);
    }
    throw error;
  }
}