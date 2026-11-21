import Button from './Button.jsx';
import Modal from './Modal.jsx';

function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Excluir',
  isLoading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal title={title} isOpen={isOpen} onClose={onCancel} size="sm">
      <p className="confirm-dialog__message">{message}</p>
      <div className="form-actions">
        <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
