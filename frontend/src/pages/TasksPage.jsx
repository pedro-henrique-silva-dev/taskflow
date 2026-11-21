import { useCallback, useState } from 'react';
import TaskFilters from '../components/tasks/TaskFilters.jsx';
import TaskForm from '../components/tasks/TaskForm.jsx';
import TaskList from '../components/tasks/TaskList.jsx';
import Button from '../components/ui/Button.jsx';
import ConfirmDialog from '../components/ui/ConfirmDialog.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Icon from '../components/ui/Icon.jsx';
import Loader from '../components/ui/Loader.jsx';
import Modal from '../components/ui/Modal.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import { useTaskFilters } from '../hooks/useTaskFilters.js';
import { useTasks } from '../hooks/useTasks.js';
import { useToast } from '../hooks/useToast.js';
import { TASK_STATUS } from '../utils/constants.js';

function TasksPage() {
  const { tasks, categories, isLoading, createTask, updateTask, toggleTaskStatus, deleteTask } =
    useTasks();
  const toast = useToast();
  const { filters, setFilter, resetFilters, filteredTasks, hasActiveFilters } =
    useTaskFilters(tasks);

  const [formState, setFormState] = useState({ isOpen: false, task: null });
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [busyTaskId, setBusyTaskId] = useState(null);

  const openCreateForm = () => setFormState({ isOpen: true, task: null });
  const openEditForm = (task) => setFormState({ isOpen: true, task });
  const closeForm = useCallback(() => setFormState({ isOpen: false, task: null }), []);
  const closeDeleteDialog = useCallback(() => setTaskToDelete(null), []);

  const handleSubmit = async (values) => {
    try {
      if (formState.task) {
        await updateTask(formState.task.id, values);
        toast.success('Tarefa atualizada com sucesso.');
      } else {
        await createTask(values);
        toast.success('Tarefa criada com sucesso.');
      }
      closeForm();
    } catch (error) {
      toast.error(error.message || 'Não foi possível salvar a tarefa.');
    }
  };

  const handleToggleStatus = async (task) => {
    setBusyTaskId(task.id);
    try {
      const updated = await toggleTaskStatus(task);
      toast.success(
        updated.status === TASK_STATUS.COMPLETED ? 'Tarefa concluída.' : 'Tarefa reaberta.',
      );
    } catch (error) {
      toast.error(error.message || 'Não foi possível atualizar a tarefa.');
    } finally {
      setBusyTaskId(null);
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTask(taskToDelete.id);
      toast.success('Tarefa excluída.');
      setTaskToDelete(null);
    } catch (error) {
      toast.error(error.message || 'Não foi possível excluir a tarefa.');
    } finally {
      setIsDeleting(false);
    }
  };

  const renderContent = () => {
    if (isLoading) return <Loader label="Carregando tarefas..." />;

    if (tasks.length === 0) {
      return (
        <EmptyState
          title="Nenhuma tarefa ainda"
          description="Crie sua primeira tarefa para começar a se organizar."
          action={<Button onClick={openCreateForm}>Criar tarefa</Button>}
        />
      );
    }

    if (filteredTasks.length === 0) {
      return (
        <EmptyState
          icon="search"
          title="Nenhuma tarefa encontrada"
          description="Ajuste a pesquisa ou os filtros para ver outras tarefas."
          action={
            <Button variant="secondary" onClick={resetFilters}>
              Limpar filtros
            </Button>
          }
        />
      );
    }

    return (
      <>
        <p className="results-count">
          {filteredTasks.length === 1
            ? '1 tarefa encontrada'
            : `${filteredTasks.length} tarefas encontradas`}
        </p>
        <TaskList
          tasks={filteredTasks}
          categories={categories}
          busyTaskId={busyTaskId}
          onToggleStatus={handleToggleStatus}
          onEdit={openEditForm}
          onDelete={setTaskToDelete}
        />
      </>
    );
  };

  return (
    <>
      <PageHeader
        title="Tarefas"
        description="Crie, organize e acompanhe suas tarefas."
        actions={
          <Button onClick={openCreateForm}>
            <Icon name="plus" size={18} />
            Nova tarefa
          </Button>
        }
      />

      <TaskFilters
        filters={filters}
        categories={categories}
        hasActiveFilters={hasActiveFilters}
        onChange={setFilter}
        onReset={resetFilters}
      />

      {renderContent()}

      <Modal
        title={formState.task ? 'Editar tarefa' : 'Nova tarefa'}
        isOpen={formState.isOpen}
        onClose={closeForm}
      >
        <TaskForm
          key={formState.task?.id ?? 'new'}
          task={formState.task}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(taskToDelete)}
        title="Excluir tarefa"
        message={`Tem certeza que deseja excluir "${taskToDelete?.title}"? Esta ação não pode ser desfeita.`}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteDialog}
      />
    </>
  );
}

export default TasksPage;
