import { useEffect, useState } from "react";
import { SERVER_URL, BACKOFFICE_URL, cleanObjectStrings } from "../../../Utils";
import NavbarBackoffice from "../../../components/NavbarBackoffice";
import { Link } from "react-router-dom";
import ModalMessage from "../../../components/ModalMessage";
import { useAuthModalGuard } from "../../Backoffice/useAuthModalGuard";
import "../../../style/Loading.css";

function Buildings() {
  const [edificios, setEdificios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({
    open: false,
    title: "",
    message: "",
    type: "info",
    action: null,
  });

  const showModal = (title, message, type = "info", actionCallback = null) => {
    setModal({
      open: true,
      title,
      message,
      type,
      action: actionCallback
        ? { label: "Login", onClick: actionCallback }
        : null,
    });
  };

  const authChecked = useAuthModalGuard(showModal);

  useEffect(() => {
    if (!authChecked) return;

    const fetchEdificios = async () => {
      setLoading(true);
      try {
        const SESSION_TOKEN = localStorage.getItem("authorization");
        if (!SESSION_TOKEN) {
          showModal(
            "Autenticação necessária",
            "Por favor, faça login para continuar.",
            "warning",
            () => window.location.assign("/backoffice/login")
          );
          return;
        }

        const res = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/listaEdificios`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${SESSION_TOKEN}`,
          },
        });

        if (res.status === 401) {
          showModal(
            "Sessão expirada",
            "Por favor, faça login novamente.",
            "warning",
            () => window.location.assign("/backoffice/login")
          );
          return;
        }

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Erro ao buscar edifícios.");
        }

        let data = await res.json();
        data = data.map(cleanObjectStrings);

        data.sort((a, b) =>
          a.data_projeto.localeCompare(b.data_projeto, undefined, {
            numeric: true,
          })
        );

        setEdificios(data);
      } catch (err) {
        showModal("Erro", "Erro ao buscar dados.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchEdificios();
  }, [authChecked]);

  if (!authChecked) {
    return (
      <ModalMessage
        isOpen={modal.open}
        onClose={() => setModal((m) => ({ ...m, open: false }))}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        action={modal.action}
      />
    );
  }

  return (
    <div>
      <ModalMessage
        isOpen={modal.open}
        onClose={() => {
          setModal((m) => ({ ...m, open: false }));
          if (modal.type === "success") window.location.reload();
        }}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        action={modal.action}
      />

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      <NavbarBackoffice />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          minHeight: "100vh",
          padding: "2rem",
          backgroundColor: "#f5f5f5",
        }}
      >
        <h2 className="title" style={{ marginBottom: "1.5rem" }}>
          Lista de Edifícios
        </h2>

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            width: "100%",
            maxWidth: "600px",
          }}
        >
          {edificios.map((obra) => (
            <li key={obra.id} style={{ marginBottom: "15px" }}>
              <Link
                to={`/Backoffice/MedioTejoB/${obra.id}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "#fff",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <span style={{ fontWeight: "bold", color: "#777" }}>
                  {obra.data_projeto}
                </span>
                <span>{obra.titulo}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Buildings;
