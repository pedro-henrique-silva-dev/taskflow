import { Link } from 'react-router';
import Icon from '../ui/Icon.jsx';

function StatCard({ label, value, icon, variant = 'primary', to }) {
  return (
    <Link to={to} className={`stat-card stat-card--${variant}`}>
      <span className="stat-card__icon">
        <Icon name={icon} size={22} />
      </span>
      <span className="stat-card__body">
        <span className="stat-card__value">{value}</span>
        <span className="stat-card__label">{label}</span>
      </span>
    </Link>
  );
}

export default StatCard;
