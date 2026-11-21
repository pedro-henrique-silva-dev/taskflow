import { PRIORITY_LABELS, TASK_STATUS } from '../../utils/constants.js';
import { describeDueDate, formatDate } from '../../utils/date.js';
import { isTaskOverdue } from '../../utils/taskFilters.js';
import Badge from '../ui/Badge.jsx';
import Icon from '../ui/Icon.jsx';

function TaskCard({ task, category, todayISO, isBusy, onToggleStatus, onEdit, onDelete }) {
  const isCompleted = task.status === TASK_STATUS.COMPLETED;
  const isOverdue = isTaskOverdue(task, todayISO);

  const classes = [
    'task-card',
    `task-card--${task.priority}`,
    isCompleted && 'task-card--completed',
    isOverdue && 'task-card--overdue',
    isBusy && 'task-card--busy',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <article className={classes}>
      <button
        type="button"
        className={`task-card__check${isCompleted ? ' task-card__check--done' : ''}`}
        onClick={() => onToggleStatus(task)}
        disabled={isBusy}
        aria-label={isCompleted ? `Reabrir "${task.title}"` : `Concluir "${task.title}"`}
        title={isCompleted ? 'Reabrir tarefa' : 'Marcar como concluída'}
      >
        {isCompleted && <Icon name="check" size={14} />}
      </button>

      <div className="task-card__content">
        <h3 className="task-card__title">{task.title}</h3>
        {task.description && <p className="task-card__description">{task.description}</p>}

        <div className="task-card__meta">
          <Badge variant={`priority-${task.priority}`}>{PRIORITY_LABELS[task.priority]}</Badge>
          {category && <Badge color={category.color}>{category.name}</Badge>}
          {isCompleted ? (
            <Badge variant="success">Concluída</Badge>
          ) : (
            task.dueDate && (
              <span
                className={`task-card__due${isOverdue ? ' task-card__due--overdue' : ''}`}
                title={formatDate(task.dueDate)}
              >
                <Icon name={isOverdue ? 'alert' : 'calendar'} size={14} />
                {describeDueDate(task.dueDate, todayISO)}
              </span>
            )
          )}
        </div>
      </div>

      <div className="task-card__actions">
        <button
          type="button"
          className="icon-btn"
          onClick={() => onToggleStatus(task)}
          disabled={isBusy}
          aria-label={isCompleted ? 'Reabrir tarefa' : 'Concluir tarefa'}
          title={isCompleted ? 'Reabrir' : 'Concluir'}
        >
          <Icon name={isCompleted ? 'undo' : 'check'} size={18} />
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={() => onEdit(task)}
          disabled={isBusy}
          aria-label="Editar tarefa"
          title="Editar"
        >
          <Icon name="edit" size={18} />
        </button>
        <button
          type="button"
          className="icon-btn icon-btn--danger"
          onClick={() => onDelete(task)}
          disabled={isBusy}
          aria-label="Excluir tarefa"
          title="Excluir"
        >
          <Icon name="trash" size={18} />
        </button>
      </div>
    </article>
  );
}

export default TaskCard;
