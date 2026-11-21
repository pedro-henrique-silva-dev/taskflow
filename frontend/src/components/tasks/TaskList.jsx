import { getTodayISO } from '../../utils/date.js';
import TaskCard from './TaskCard.jsx';

function TaskList({ tasks, categories, busyTaskId, onToggleStatus, onEdit, onDelete }) {
  const todayISO = getTodayISO();
  const categoriesById = new Map(categories.map((category) => [category.id, category]));

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskCard
            task={task}
            category={categoriesById.get(task.categoryId)}
            todayISO={todayISO}
            isBusy={busyTaskId === task.id}
            onToggleStatus={onToggleStatus}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  );
}

export default TaskList;
