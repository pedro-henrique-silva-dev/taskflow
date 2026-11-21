import Icon from './Icon.jsx';

function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.type}`} role="status">
          <Icon name={toast.type === 'error' ? 'alert' : 'check'} size={18} />
          <span className="toast__message">{toast.message}</span>
          <button
            type="button"
            className="icon-btn icon-btn--sm"
            onClick={() => onDismiss(toast.id)}
            aria-label="Fechar notificação"
          >
            <Icon name="close" size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
