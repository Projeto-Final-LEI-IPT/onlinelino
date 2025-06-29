import React, { useEffect, useState } from "react";
import NavbarBackoffice from "../../../components/NavbarBackoffice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../../style/Backoffice.css";
import "../../../style/Loading.css";
import { BACKOFFICE_URL, SERVER_URL, hasContentChanged } from "../../../Utils";
import { useAuthModalGuard } from "../../Backoffice/useAuthModalGuard";
import ModalMessage from "../../../components/ModalMessage";

function MaterialsB() {
  const [textoPT, setTextoPT] = useState("");
  const [textoEN, setTextoEN] = useState("");
  const [originalTextoPT, setOriginalTextoPT] = useState("");
  const [originalTextoEN, setOriginalTextoEN] = useState("");
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    action: null,
  });

  const showModal = (title, message, type = "info", action = null) => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      action,
    });
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
    if (modal.type === "success") {
            window.location.reload();
          }
  };

  const authChecked = useAuthModalGuard(showModal);
  const SESSION_TOKEN = localStorage.getItem("authorization");

  const isOnlyParagraphsValid = (html) => {
    try {
      const doc = new DOMParser().parseFromString(`<div>${html}</div>`, "text/html");
      const container = doc.body.firstChild;
      if (!container) return false;

      const children = Array.from(container.children);
      return children.length > 0 && children.every((child) => child.tagName === "P");
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (!authChecked) return;

    const fetchConteudo = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/materiais/1`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${SESSION_TOKEN}`,
          },
        });

        if (response.status === 401) {
          showModal(
            "Sessão expirada",
            "Por favor, faça login novamente.",
            "warning",
            {
              label: "Login",
              onClick: () => (window.location.href = "/backoffice/login"),
            }
          );
          return;
        }

        if (!response.ok) throw new Error("Erro ao buscar os materiais.");

        const data = await response.json();
        if (data.length > 0) {
          setTextoPT(data[0].descricao_pt || "");
          setTextoEN(data[0].descricao_en || "");
          setOriginalTextoPT(data[0].descricao_pt || "");
          setOriginalTextoEN(data[0].descricao_en || "");
        }
      } catch (err) {
        showModal("Erro", err.message, "error");
      } finally {
        setLoading(false);
      }
    };

    fetchConteudo();
  }, [authChecked, SESSION_TOKEN]);

  const handleSalvar = async () => {
    if (!isOnlyParagraphsValid(textoPT) || !isOnlyParagraphsValid(textoEN)) {
      showModal(
        "Conteúdo inválido",
        "Apenas parágrafos são permitidos. Remova títulos, listas ou imagens.",
        "warning"
      );
      return;
    }

    const houveAlteracoesTexto = hasContentChanged(
      { pt: originalTextoPT, en: originalTextoEN },
      { pt: textoPT, en: textoEN }
    );

    if (!houveAlteracoesTexto) {
      showModal("Sem alterações", "Nenhuma modificação foi detectada.", "info");
      return;
    }

    try {
      const response = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/materiais/1`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SESSION_TOKEN}`,
        },
        body: JSON.stringify({
          descricao_pt: textoPT,
          descricao_en: textoEN,
        }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar textos.");

      setOriginalTextoPT(textoPT);
      setOriginalTextoEN(textoEN);
      showModal("Sucesso", "Materiais atualizados com sucesso!", "success");
    } catch (err) {
      showModal("Erro", err.message, "error");
    }
  };

  return (
    <div>
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      <NavbarBackoffice />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "40px" }}>Materiais</h2>

        <div style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
          <div style={{ flex: 1 }}>
            <h3>Português</h3>
            <ReactQuill theme="snow" value={textoPT} onChange={setTextoPT} />
          </div>
          <div style={{ flex: 1 }}>
            <h3>Inglês</h3>
            <ReactQuill theme="snow" value={textoEN} onChange={setTextoEN} />
          </div>
        </div>

        <div
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            zIndex: 10,
          }}
        >
          <button
            onClick={handleSalvar}
            style={{
              backgroundColor: "#114c44",
              color: "#fff",
              padding: "14px 24px",
              borderRadius: "50px",
              border: "none",
              fontSize: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              cursor: "pointer",
            }}
          >
            Guardar
          </button>
        </div>
      </div>

      <ModalMessage
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        action={modal.action}
      />
    </div>
  );
}

export default MaterialsB;