import { SORT_OPTIONS, STATUS_FILTER_OPTIONS } from '../../utils/constants.js';
import Button from '../ui/Button.jsx';
import Icon from '../ui/Icon.jsx';

function TaskFilters({ filters, categories, hasActiveFilters, onChange, onReset }) {
  const handleChange = (event) => onChange(event.target.name, event.target.value);

  return (
    <section className="filters" aria-label="Pesquisa e filtros">
      <div className="filters__search">
        <Icon name="search" size={18} />
        <input
          className="input"
          type="search"
          name="search"
          placeholder="Pesquisar tarefas..."
          value={filters.search}
          onChange={handleChange}
          aria-label="Pesquisar tarefas"
        />
      </div>

      <select
        className="input"
        name="status"
        value={filters.status}
        onChange={handleChange}
        aria-label="Filtrar por status"
      >
        {STATUS_FILTER_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        className="input"
        name="category"
        value={filters.category}
        onChange={handleChange}
        aria-label="Filtrar por categoria"
      >
        <option value="all">Todas as categorias</option>
        <option value="none">Sem categoria</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <select
        className="input"
        name="sort"
        value={filters.sort}
        onChange={handleChange}
        aria-label="Ordenar por"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            Ordenar: {option.label}
          </option>
        ))}
      </select>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onReset}>
          Limpar filtros
        </Button>
      )}
    </section>
  );
}

export default TaskFilters;
