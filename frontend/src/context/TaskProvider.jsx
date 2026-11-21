import { useCallback, useEffect, useMemo, useState } from 'react';
import * as categoryService from '../services/categoryService.js';
import * as taskService from '../services/taskService.js';
import { TASK_STATUS } from '../utils/constants.js';
import { TaskContext } from './TaskContext.js';

function fetchInitialData() {
  return Promise.all([taskService.listTasks(), categoryService.listCategories()]);
}

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const applyLoadResult = useCallback((promise) => {
    return promise
      .then(([loadedTasks, loadedCategories]) => {
        setTasks(loadedTasks);
        setCategories(loadedCategories);
        setLoadError(null);
      })
      .catch(() => setLoadError('Não foi possível carregar os dados. Tente novamente.'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    applyLoadResult(fetchInitialData());
  }, [applyLoadResult]);

  const reload = useCallback(() => {
    setIsLoading(true);
    return applyLoadResult(fetchInitialData());
  }, [applyLoadResult]);

  const replaceTask = (updated) =>
    setTasks((current) => current.map((task) => (task.id === updated.id ? updated : task)));

  const createTask = useCallback(async (values) => {
    const task = await taskService.createTask(values);
    setTasks((current) => [...current, task]);
    return task;
  }, []);

  const updateTask = useCallback(async (id, values) => {
    const task = await taskService.updateTask(id, values);
    replaceTask(task);
    return task;
  }, []);

  const toggleTaskStatus = useCallback(async (task) => {
    const nextStatus =
      task.status === TASK_STATUS.COMPLETED ? TASK_STATUS.PENDING : TASK_STATUS.COMPLETED;
    const updated = await taskService.setTaskStatus(task.id, nextStatus);
    replaceTask(updated);
    return updated;
  }, []);

  const deleteTask = useCallback(async (id) => {
    await taskService.deleteTask(id);
    setTasks((current) => current.filter((task) => task.id !== id));
  }, []);

  const createCategory = useCallback(async (values) => {
    const category = await categoryService.createCategory(values);
    setCategories((current) => [...current, category]);
    return category;
  }, []);

  const updateCategory = useCallback(async (id, values) => {
    const category = await categoryService.updateCategory(id, values);
    setCategories((current) => current.map((item) => (item.id === id ? category : item)));
    return category;
  }, []);

  const deleteCategory = useCallback(async (id) => {
    await categoryService.deleteCategory(id);
    setCategories((current) => current.filter((category) => category.id !== id));
    setTasks((current) =>
      current.map((task) => (task.categoryId === id ? { ...task, categoryId: null } : task)),
    );
  }, []);

  const value = useMemo(
    () => ({
      tasks,
      categories,
      isLoading,
      loadError,
      reload,
      createTask,
      updateTask,
      toggleTaskStatus,
      deleteTask,
      createCategory,
      updateCategory,
      deleteCategory,
    }),
    [
      tasks,
      categories,
      isLoading,
      loadError,
      reload,
      createTask,
      updateTask,
      toggleTaskStatus,
      deleteTask,
      createCategory,
      updateCategory,
      deleteCategory,
    ],
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}
