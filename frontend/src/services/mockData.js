import { addDays, getTodayISO } from '../utils/date.js';

// Dados de exemplo usados apenas enquanto o frontend não está integrado à API (FASE 5).
export function createMockData() {
  const today = getTodayISO();
  const now = new Date().toISOString();
  const daysAgo = (days) => `${addDays(today, -days)}T12:00:00.000Z`;

  const categories = [
    { id: 'cat-trabalho', name: 'Trabalho', color: '#4f46e5', createdAt: now },
    { id: 'cat-estudos', name: 'Estudos', color: '#10b981', createdAt: now },
    { id: 'cat-pessoal', name: 'Pessoal', color: '#f59e0b', createdAt: now },
  ];

  const task = (data) => ({
    description: '',
    categoryId: null,
    dueDate: null,
    status: 'pending',
    completedAt: null,
    createdAt: now,
    updatedAt: now,
    ...data,
  });

  const tasks = [
    task({
      id: 'task-1',
      title: 'Finalizar relatório mensal',
      description: 'Consolidar os indicadores do mês e enviar para a equipe.',
      priority: 'high',
      categoryId: 'cat-trabalho',
      dueDate: addDays(today, -2),
      createdAt: daysAgo(6),
    }),
    task({
      id: 'task-2',
      title: 'Estudar hooks do React',
      description: 'Revisar useState, useEffect, useMemo e hooks personalizados.',
      priority: 'medium',
      categoryId: 'cat-estudos',
      dueDate: today,
      createdAt: daysAgo(4),
    }),
    task({
      id: 'task-3',
      title: 'Agendar consulta médica',
      priority: 'low',
      categoryId: 'cat-pessoal',
      dueDate: addDays(today, 3),
      createdAt: daysAgo(3),
    }),
    task({
      id: 'task-4',
      title: 'Preparar apresentação da sprint',
      description: 'Montar os slides com as entregas da sprint.',
      priority: 'high',
      categoryId: 'cat-trabalho',
      dueDate: addDays(today, 1),
      createdAt: daysAgo(2),
    }),
    task({
      id: 'task-5',
      title: 'Ler capítulo sobre APIs REST',
      priority: 'medium',
      categoryId: 'cat-estudos',
      status: 'completed',
      completedAt: daysAgo(1),
      createdAt: daysAgo(5),
    }),
    task({
      id: 'task-6',
      title: 'Organizar a mesa de trabalho',
      priority: 'low',
      status: 'completed',
      completedAt: daysAgo(2),
      createdAt: daysAgo(7),
    }),
  ];

  return { categories, tasks };
}
