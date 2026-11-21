import { TASK_STATUS } from './constants.js';
import { addDays } from './date.js';
import { isTaskOverdue } from './taskFilters.js';

export function getTaskStats(tasks, todayISO) {
  const pendingTasks = tasks.filter((task) => task.status === TASK_STATUS.PENDING);
  const completedTasks = tasks.filter((task) => task.status === TASK_STATUS.COMPLETED);
  const overdueTasks = pendingTasks.filter((task) => isTaskOverdue(task, todayISO));
  const weekAgoISO = addDays(todayISO, -6);

  const upcomingTasks = pendingTasks
    .filter((task) => task.dueDate && task.dueDate >= todayISO)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  return {
    total: tasks.length,
    pending: pendingTasks.length,
    completed: completedTasks.length,
    overdue: overdueTasks.length,
    dueToday: pendingTasks.filter((task) => task.dueDate === todayISO).length,
    completedLast7Days: completedTasks.filter(
      (task) => task.completedAt && task.completedAt.slice(0, 10) >= weekAgoISO,
    ).length,
    completionRate: tasks.length ? Math.round((completedTasks.length / tasks.length) * 100) : 0,
    pendingByPriority: {
      high: pendingTasks.filter((task) => task.priority === 'high').length,
      medium: pendingTasks.filter((task) => task.priority === 'medium').length,
      low: pendingTasks.filter((task) => task.priority === 'low').length,
    },
    overdueTasks: overdueTasks.sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    upcomingTasks,
  };
}
