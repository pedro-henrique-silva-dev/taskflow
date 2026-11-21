import { NavLink } from 'react-router';
import { useTasks } from '../../hooks/useTasks.js';
import { TASK_STATUS } from '../../utils/constants.js';
import Icon from '../ui/Icon.jsx';
import ThemeToggle from '../ui/ThemeToggle.jsx';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: 'dashboard', end: true },
  { to: '/tarefas', label: 'Tarefas', icon: 'tasks' },
  { to: '/categorias', label: 'Categorias', icon: 'tag' },
];

function Sidebar({ isOpen, onClose }) {
  const { tasks } = useTasks();
  const completed = tasks.filter((task) => task.status === TASK_STATUS.COMPLETED).length;
  const rate = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <aside className={`sidebar${isOpen ? ' sidebar--open' : ''}`} aria-label="Menu principal">
      <div className="sidebar__brand">
        <span className="brand-logo" aria-hidden="true">
          <Icon name="check" size={18} />
        </span>
        <span className="brand-name">TaskFlow</span>
        <button
          type="button"
          className="icon-btn sidebar__close"
          onClick={onClose}
          aria-label="Fechar menu"
        >
          <Icon name="close" />
        </button>
      </div>
      <nav className="sidebar__nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onClose}
            className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
          >
            <Icon name={item.icon} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar-progress">
          <div className="sidebar-progress__header">
            <span>Seu progresso</span>
            <strong>{rate}%</strong>
          </div>
          <div
            className="progress"
            role="progressbar"
            aria-valuenow={rate}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progresso geral"
          >
            <span className="progress__bar" style={{ width: `${rate}%` }} />
          </div>
          <p className="sidebar-progress__caption">
            {completed} de {tasks.length} tarefas concluídas
          </p>
        </div>
        <ThemeToggle showLabel />
      </div>
    </aside>
  );
}

export default Sidebar;
