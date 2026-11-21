import { Route, Routes } from 'react-router';
import AppLayout from './components/layout/AppLayout.jsx';
import Button from './components/ui/Button.jsx';
import { useTasks } from './hooks/useTasks.js';
import CategoriesPage from './pages/CategoriesPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import TasksPage from './pages/TasksPage.jsx';

function App() {
  const { loadError, reload } = useTasks();

  return (
    <>
      {loadError && (
        <div className="alert alert--error" role="alert">
          <span>{loadError}</span>
          <Button variant="secondary" size="sm" onClick={reload}>
            Tentar novamente
          </Button>
        </div>
      )}
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="tarefas" element={<TasksPage />} />
          <Route path="categorias" element={<CategoriesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
