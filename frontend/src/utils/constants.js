export const PRIORITIES = [
  { value: 'high', label: 'Alta' },
  { value: 'medium', label: 'Média' },
  { value: 'low', label: 'Baixa' },
];

export const PRIORITY_LABELS = Object.fromEntries(
  PRIORITIES.map(({ value, label }) => [value, label]),
);

export const PRIORITY_WEIGHT = { high: 3, medium: 2, low: 1 };

export const TASK_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
};

export const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Pendentes' },
  { value: 'completed', label: 'Concluídas' },
  { value: 'overdue', label: 'Atrasadas' },
];

export const SORT_OPTIONS = [
  { value: 'dueDate', label: 'Data de vencimento' },
  { value: 'priority', label: 'Prioridade' },
  { value: 'createdAt', label: 'Mais recentes' },
  { value: 'title', label: 'Título (A-Z)' },
];

export const DEFAULT_FILTERS = {
  search: '',
  status: 'all',
  category: 'all',
  sort: 'dueDate',
};

export const CATEGORY_COLORS = [
  '#4f46e5',
  '#0ea5e9',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#ec4899',
  '#8b5cf6',
  '#64748b',
];

export const TASK_LIMITS = {
  TITLE_MIN: 3,
  TITLE_MAX: 100,
  DESCRIPTION_MAX: 500,
};

export const CATEGORY_LIMITS = {
  NAME_MIN: 2,
  NAME_MAX: 30,
};
