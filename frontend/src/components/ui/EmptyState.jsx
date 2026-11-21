import Icon from './Icon.jsx';

function EmptyState({ icon = 'tasks', title, description, action }) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon">
        <Icon name={icon} size={32} />
      </span>
      <h3 className="empty-state__title">{title}</h3>
      {description && <p className="empty-state__description">{description}</p>}
      {action}
    </div>
  );
}

export default EmptyState;
