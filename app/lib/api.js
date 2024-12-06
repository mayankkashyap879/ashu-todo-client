// app/lib/api.js
const API_BASE_URL = 'http://localhost:4001/todos';

export async function getAllTodos(filters = {}) {
  console.log("getAllTodos");
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.priority) queryParams.append('priority', filters.priority);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);

    const url = `${API_BASE_URL}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error('Failed to fetch todos');
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching todos:', error);
    return [];
  }
}

export async function addTodo(todo) {
  try {
    const response = await fetch(API_BASE_URL, {
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

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to add todo');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding todo:', error);
    throw error;
  }
}

export async function updateTodo(id, updates) {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update todo');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
}

export async function getUpcomingTodos() {
  try {
    const response = await fetch(`${API_BASE_URL}/upcoming`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error('Failed to fetch upcoming todos');
    }
    
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching upcoming todos:', error);
    return [];
  }
}

export async function deleteTodo(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete todo');
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
}