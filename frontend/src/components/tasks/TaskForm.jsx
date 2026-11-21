import { useState } from 'react';
import { PRIORITIES, TASK_LIMITS } from '../../utils/constants.js';
import { hasErrors, validateTask } from '../../utils/validation.js';
import Button from '../ui/Button.jsx';
import FormField from '../ui/FormField.jsx';

const EMPTY_TASK = {
  title: '',
  description: '',
  priority: 'medium',
  categoryId: '',
  dueDate: '',
};

function toFormValues(task) {
  if (!task) return EMPTY_TASK;
  return {
    title: task.title,
    description: task.description,
    priority: task.priority,
    categoryId: task.categoryId ?? '',
    dueDate: task.dueDate ?? '',
  };
}

function TaskForm({ task, categories, onSubmit, onCancel }) {
  const [values, setValues] = useState(() => toFormValues(task));
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateTask(values);
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldProps = (name) => ({
    id: `task-${name}`,
    name,
    value: values[name],
    onChange: handleChange,
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `task-${name}-error` : undefined,
  });

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <FormField label="Título *" htmlFor="task-title" error={errors.title}>
        <input
          className="input"
          type="text"
          placeholder="Ex.: Revisar o relatório"
          maxLength={TASK_LIMITS.TITLE_MAX}
          autoFocus
          {...fieldProps('title')}
        />
      </FormField>

      <FormField
        label="Descrição"
        htmlFor="task-description"
        error={errors.description}
        hint={`${values.description.length}/${TASK_LIMITS.DESCRIPTION_MAX} caracteres`}
      >
        <textarea
          className="input input--textarea"
          rows={3}
          placeholder="Detalhes da tarefa (opcional)"
          maxLength={TASK_LIMITS.DESCRIPTION_MAX}
          {...fieldProps('description')}
        />
      </FormField>

      <div className="form-row">
        <FormField label="Prioridade" htmlFor="task-priority" error={errors.priority}>
          <select className="input" {...fieldProps('priority')}>
            {PRIORITIES.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Categoria" htmlFor="task-categoryId">
          <select className="input" {...fieldProps('categoryId')}>
            <option value="">Sem categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Vencimento" htmlFor="task-dueDate" error={errors.dueDate}>
          <input className="input" type="date" {...fieldProps('dueDate')} />
        </FormField>
      </div>

      <div className="form-actions">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {task ? 'Salvar alterações' : 'Criar tarefa'}
        </Button>
      </div>
    </form>
  );
}

export default TaskForm;
