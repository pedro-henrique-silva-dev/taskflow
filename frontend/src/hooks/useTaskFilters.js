import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { DEFAULT_FILTERS } from '../utils/constants.js';
import { getTodayISO } from '../utils/date.js';
import { filterTasks, sortTasks } from '../utils/taskFilters.js';

// Os filtros ficam na URL (?status=overdue&sort=priority), permitindo links diretos do dashboard.
export function useTaskFilters(tasks) {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () => ({
      search: searchParams.get('search') ?? DEFAULT_FILTERS.search,
      status: searchParams.get('status') ?? DEFAULT_FILTERS.status,
      category: searchParams.get('category') ?? DEFAULT_FILTERS.category,
      sort: searchParams.get('sort') ?? DEFAULT_FILTERS.sort,
    }),
    [searchParams],
  );

  const setFilter = useCallback(
    (name, value) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          if (value === DEFAULT_FILTERS[name]) next.delete(name);
          else next.set(name, value);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const resetFilters = useCallback(() => setSearchParams({}, { replace: true }), [setSearchParams]);

  const filteredTasks = useMemo(() => {
    const todayISO = getTodayISO();
    return sortTasks(filterTasks(tasks, filters, todayISO), filters.sort);
  }, [tasks, filters]);

  const hasActiveFilters = Object.keys(DEFAULT_FILTERS).some(
    (name) => name !== 'sort' && filters[name] !== DEFAULT_FILTERS[name],
  );

  return { filters, setFilter, resetFilters, filteredTasks, hasActiveFilters };
}
