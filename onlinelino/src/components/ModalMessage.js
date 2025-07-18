import '../style/ModalMessage.css';

function ModalMessage({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  title,
  message,
  type = "info",
  action
}) {
  if (!isOpen) return null;

  return (
    <div className="custom-modal-overlay">
      <div className={`custom-modal-content custom-modal-${type}`}>
        <h3>{title}</h3>
        <p>{message}</p>

        <div style={{ textAlign: "center", marginTop: "1rem", display: "flex", justifyContent: "center", gap: "1rem" }}>
          {type === "confirm" ? (
            <>
              <button
                className="custom-modal-close-button"
                onClick={onCancel}
                style={{ backgroundColor: "#aaa" }}
              >
                Cancelar
              </button>
              <button
                className="custom-modal-close-button"
                onClick={onConfirm}
                style={{ backgroundColor: "#007bff" }}
              >
                Confirmar
              </button>
            </>
          ) : action ? (
            <button className="custom-modal-close-button" onClick={action.onClick}>
              {action.label}
            </button>
          ) : (
            <button className="custom-modal-close-button" onClick={onClose}>
              Fechar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModalMessage;
