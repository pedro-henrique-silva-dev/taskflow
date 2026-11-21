import { Link } from 'react-router';
import EmptyState from '../components/ui/EmptyState.jsx';

function NotFoundPage() {
  return (
    <EmptyState
      icon="alert"
      title="Página não encontrada"
      description="O endereço acessado não existe."
      action={
        <Link to="/" className="btn btn--primary btn--md">
          Voltar ao dashboard
        </Link>
      }
    />
  );
}

export default NotFoundPage;
