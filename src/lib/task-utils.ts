import { TimerTask } from '@/types';

interface TaskAction {
  type: 'add' | 'delete' | 'update';
  task: TimerTask;
  previousState?: TimerTask;
}

let taskHistory: TaskAction[] = [];
const MAX_HISTORY = 50;

export const addToHistory = (action: TaskAction) => {
  taskHistory = [action, ...taskHistory.slice(0, MAX_HISTORY - 1)];
};

export const undoLastAction = () => {
  const lastAction = taskHistory[0];
  if (!lastAction) return null;

  // Remove the action from history
  taskHistory = taskHistory.slice(1);

  const savedTasks = localStorage.getItem('timerTasks');
  const currentTasks: TimerTask[] = savedTasks ? JSON.parse(savedTasks) : [];

  let updatedTasks: TimerTask[];
  switch (lastAction.type) {
    case 'add':
      // Remove the added task
      updatedTasks = currentTasks.filter(t => t.id !== lastAction.task.id);
      break;
    case 'delete':
      // Restore the deleted task
      updatedTasks = [...currentTasks, lastAction.task];
      break;
    case 'update':
      // Restore the previous state
      updatedTasks = currentTasks.map(t => 
        t.id === lastAction.task.id ? (lastAction.previousState || t) : t
      );
      break;
    default:
      return null;
  }

  localStorage.setItem('timerTasks', JSON.stringify(updatedTasks));
  window.dispatchEvent(new CustomEvent('taskUpdated'));
  return lastAction;
};

export const saveTaskToStorage = (task: Partial<TimerTask>) => {
  const savedTasks = localStorage.getItem('timerTasks');
  const currentTasks: TimerTask[] = savedTasks ? JSON.parse(savedTasks) : [];
  
  // Check if task with this ID already exists
  const existingTask = currentTasks.find(t => t.id === task.id);
  if (existingTask) {
    throw new Error('Task already exists');
  }

  const newTask: TimerTask = {
    id: task.id || `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: task.title || 'Untitled Task',
    duration: task.duration || 1800,
    timeLeft: task.timeLeft || task.duration || 1800,
    completed: task.completed || false,
    isRunning: false,
    createdAt: task.createdAt || new Date().toISOString(),
    lastRunAt: task.lastRunAt || null,
    archived: false,
    source: task.source || 'manual'
  };

  const updatedTasks = [...currentTasks, newTask];
  localStorage.setItem('timerTasks', JSON.stringify(updatedTasks));
  
  // Add to history
  addToHistory({
    type: 'add',
    task: newTask
  });

  window.dispatchEvent(new CustomEvent('taskAdded', { detail: newTask }));
  return newTask;
};

export const deleteTask = (taskId: string) => {
  const savedTasks = localStorage.getItem('timerTasks');
  const currentTasks: TimerTask[] = savedTasks ? JSON.parse(savedTasks) : [];
  
  const taskToDelete = currentTasks.find(t => t.id === taskId);
  if (!taskToDelete) return;

  const updatedTasks = currentTasks.filter(t => t.id !== taskId);
  localStorage.setItem('timerTasks', JSON.stringify(updatedTasks));

  // Add to history
  addToHistory({
    type: 'delete',
    task: taskToDelete
  });

  window.dispatchEvent(new CustomEvent('taskUpdated'));
};

export const updateTask = (taskId: string, updates: Partial<TimerTask>) => {
  const savedTasks = localStorage.getItem('timerTasks');
  const currentTasks: TimerTask[] = savedTasks ? JSON.parse(savedTasks) : [];
  
  const previousTask = currentTasks.find(t => t.id === taskId);
  if (!previousTask) return;

  const updatedTasks = currentTasks.map(t => {
    if (t.id === taskId) {
      const updatedTask = { 
        ...t, 
        ...updates,
        // Don't reset timeLeft when completing/uncompleting
        timeLeft: updates.completed === false ? t.timeLeft : updates.timeLeft ?? t.timeLeft
      };
      
      // Add to history
      addToHistory({
        type: 'update',
        task: updatedTask,
        previousState: previousTask
      });
      
      return updatedTask;
    }
    return t;
  });

  localStorage.setItem('timerTasks', JSON.stringify(updatedTasks));
  window.dispatchEvent(new CustomEvent('taskUpdated'));
};
