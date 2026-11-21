import { useMemo } from 'react';
import { Link } from 'react-router';
import ProductivityCard from '../components/dashboard/ProductivityCard.jsx';
import StatCard from '../components/dashboard/StatCard.jsx';
import TaskPreviewList from '../components/dashboard/TaskPreviewList.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Loader from '../components/ui/Loader.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import { useTasks } from '../hooks/useTasks.js';
import { formatLongDate, getGreeting, getTodayISO } from '../utils/date.js';
import { getTaskStats } from '../utils/taskStats.js';

function DashboardPage() {
  const { tasks, isLoading } = useTasks();
  const todayISO = getTodayISO();
  const stats = useMemo(() => getTaskStats(tasks, todayISO), [tasks, todayISO]);

  return (
    <>
      <PageHeader
        eyebrow={formatLongDate()}
        title={`${getGreeting()}!`}
        description="Aqui está o resumo das suas tarefas e da sua produtividade."
      />

      {isLoading ? (
        <Loader label="Carregando resumo..." />
      ) : tasks.length === 0 ? (
        <EmptyState
          icon="dashboard"
          title="Nenhuma tarefa cadastrada"
          description="Crie sua primeira tarefa para acompanhar seus indicadores."
          action={
            <Link to="/tarefas" className="btn btn--primary btn--md">
              Ir para tarefas
            </Link>
          }
        />
      ) : (
        <div className="dashboard">
          <div className="stats-grid">
            <StatCard label="Total de tarefas" value={stats.total} icon="tasks" to="/tarefas" />
            <StatCard
              label="Pendentes"
              value={stats.pending}
              icon="clock"
              variant="warning"
              to="/tarefas?status=pending"
            />
            <StatCard
              label="Concluídas"
              value={stats.completed}
              icon="check"
              variant="success"
              to="/tarefas?status=completed"
            />
            <StatCard
              label="Atrasadas"
              value={stats.overdue}
              icon="alert"
              variant="danger"
              to="/tarefas?status=overdue"
            />
          </div>

          <div className="dashboard__grid">
            <ProductivityCard stats={stats} />
            <TaskPreviewList
              title="Tarefas atrasadas"
              tasks={stats.overdueTasks}
              todayISO={todayISO}
              emptyMessage="Nenhuma tarefa atrasada. Bom trabalho!"
              viewAllTo="/tarefas?status=overdue"
              variant="overdue"
            />
            <TaskPreviewList
              title="Próximos vencimentos"
              tasks={stats.upcomingTasks}
              todayISO={todayISO}
              emptyMessage="Nenhuma tarefa pendente com prazo definido."
              viewAllTo="/tarefas?status=pending&sort=dueDate"
              variant="upcoming"
            />
          </div>
        </div>
      )}
    </>
  );
}

export default DashboardPage;
