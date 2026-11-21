import { Link } from 'react-router';
import { PRIORITY_LABELS } from '../../utils/constants.js';
import { describeDueDate } from '../../utils/date.js';
import Badge from '../ui/Badge.jsx';

const MAX_ITEMS = 5;

function TaskPreviewList({ title, tasks, todayISO, emptyMessage, viewAllTo, variant }) {
  return (
    <section className="card">
      <div className="card__header">
        <h2 className="card__title">{title}</h2>
        {tasks.length > 0 && (
          <Link to={viewAllTo} className="card__link">
            Ver todas
          </Link>
        )}
      </div>

      {tasks.length === 0 ? (
        <p className="card__empty">{emptyMessage}</p>
      ) : (
        <ul className="preview-list">
          {tasks.slice(0, MAX_ITEMS).map((task) => (
            <li key={task.id} className="preview-list__item">
              <span className="preview-list__title">{task.title}</span>
              <span className="preview-list__meta">
                <Badge variant={`priority-${task.priority}`}>{PRIORITY_LABELS[task.priority]}</Badge>
                <span className={`preview-list__due preview-list__due--${variant}`}>
                  {describeDueDate(task.dueDate, todayISO)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default TaskPreviewList;
