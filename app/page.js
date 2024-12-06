'use client'
import { useState, useEffect } from 'react';
import { Plus, Trash2, Check, Calendar, Search, Star, Filter, Clock } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getAllTodos, addTodo, updateTodo, deleteTodo, getUpcomingTodos } from './lib/api';

export default function EnhancedTodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', description: '', dueDate: '', priority: 'medium' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dateCreated');
  const [showReminders, setShowReminders] = useState(true);

  useEffect(() => {
    loadTodos();
  }, [filter, sortBy]);

  async function loadTodos() {
    try {
      setLoading(true);
      const data = await getAllTodos({
        status: filter === 'all' ? undefined : filter,
        sortBy,
        search: searchQuery
      });
      setTodos(data);
      setError(null);
    } catch (err) {
      setError('Failed to load todos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTodo(e) {
    e.preventDefault();
    if (!newTodo.title.trim()) return;

    try {
      const addedTodo = await addTodo(newTodo);
      setTodos(prev => [...prev, addedTodo]);
      setNewTodo({ title: '', description: '', dueDate: '', priority: 'medium' });
      setError(null);
    } catch (err) {
      setError('Failed to add todo');
      console.error(err);
    }
  }

  async function handleToggleTodo(id) {
    try {
      const todo = todos.find(t => t._id === id);
      const newStatus = todo.Status === 'completed' ? 'pending' : 'completed';
      const updatedTodo = await updateTodo(id, { Status: newStatus });
      setTodos(prev => prev.map(t => t._id === id ? updatedTodo : t));
      setError(null);
    } catch (err) {
      setError('Failed to update todo');
      console.error(err);
    }
  }

  async function handleDeleteTodo(id) {
    try {
      await deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo._id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete todo');
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-xl text-foreground">Loading todos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Todo List</h1>
          <div className="flex gap-4">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-background text-foreground"
            >
              <option value="dateCreated">Date Created</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </select>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-background text-foreground"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="highPriority">High Priority</option>
            </select>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {showReminders && todos.some(todo => {
          if (!todo.dueDate) return false;
          const dueDate = new Date(todo.dueDate);
          const today = new Date();
          const diffTime = dueDate - today;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays <= 3 && diffDays >= 0 && todo.Status !== 'completed';
        }) && (
          <Alert className="mb-6">
            <Clock className="h-4 w-4" />
            <AlertDescription>
              You have tasks due in the next 3 days!
            </AlertDescription>
          </Alert>
        )}

        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search todos..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <form onSubmit={handleAddTodo} className="flex flex-col gap-3 p-4 bg-card rounded-lg shadow-sm">
            <input
              type="text"
              value={newTodo.title}
              onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
              placeholder="Task title..."
              className="px-4 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground"
            />
            <textarea
              value={newTodo.description}
              onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
              placeholder="Add a description... (optional)"
              className="px-4 py-2 border rounded-lg bg-background text-foreground placeholder:text-muted-foreground resize-vertical min-h-[60px]"
            />
            <div className="flex gap-4">
              <input
                type="date"
                value={newTodo.dueDate}
                onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
                className="px-4 py-2 border rounded-lg bg-background text-foreground"
              />
              <select
                value={newTodo.priority}
                onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value })}
                className="px-4 py-2 border rounded-lg bg-background text-foreground"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-3">
          {todos.map(todo => (
            <div
              key={todo._id}
              className={`flex items-center gap-3 p-4 bg-card rounded-lg shadow-sm
                ${todo.priority === 'high' ? 'border-l-4 border-destructive' : ''}
                ${todo.dueDate && new Date(todo.dueDate) < new Date() ? 'bg-destructive/10' : ''}`}
            >
              <button
                onClick={() => handleToggleTodo(todo._id)}
                className={`flex items-center justify-center w-5 h-5 rounded border
                  ${todo.Status === 'completed' 
                    ? 'bg-primary border-primary' 
                    : 'border-input hover:border-primary'}`}
              >
                {todo.Status === 'completed' && <Check className="w-4 h-4 text-primary-foreground" />}
              </button>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`${todo.Status === 'completed' ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                    {todo.title}
                  </span>
                  {todo.priority === 'high' && <Star className="w-4 h-4 text-destructive" />}
                </div>
                {todo.description && (
                  <p className="text-sm text-muted-foreground mt-1">{todo.description}</p>
                )}
                {todo.dueDate && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(todo.dueDate).toLocaleDateString()}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleDeleteTodo(todo._id)}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          
          {todos.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No todos found. {filter !== 'all' && 'Try changing the filter or '} Add one above!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}