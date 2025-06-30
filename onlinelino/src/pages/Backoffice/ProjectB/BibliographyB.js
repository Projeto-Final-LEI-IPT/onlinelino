import React, { useState, useEffect } from "react";
import NavbarBackoffice from "../../../components/NavbarBackoffice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../../style/Backoffice.css";
import "../../../style/Loading.css";
import { BACKOFFICE_URL, SERVER_URL, hasContentChanged } from "../../../Utils";
import ModalMessage from "../../../components/ModalMessage";
import { useAuthModalGuard } from "../../Backoffice/useAuthModalGuard";

function BibliographyB() {
  const [bibliografia, setBibliografia] = useState({ texto_html: "", id: null });
  const [originalBibliografia, setOriginalBibliografia] = useState({ texto_html: "", id: null });
  const [loading, setLoading] = useState(false);
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
      action: actionCallback ? { label: "Login", onClick: actionCallback } : null,
    });
  };

  const authChecked = useAuthModalGuard(showModal);

  useEffect(() => {
    if (!authChecked) return; 

    const SESSION_TOKEN = localStorage.getItem("authorization");
    if (!SESSION_TOKEN) return; 

    const fetchBibliografia = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/bibliografia`, {
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
            () => window.location.assign("/backoffice/login")
          );
          return;
        }

        if (!response.ok) throw new Error();

        const data = await response.json();
        const item = data[0] || { texto_html: "", id: null };
        setBibliografia(item);
        setOriginalBibliografia(item);
      } catch {
        showModal("Erro interno.", "Por favor, tente novamente mais tarde.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchBibliografia();
  }, [authChecked]);

  const isValidListHTML = (html) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const body = doc.body;

      if (body.children.length !== 1) return false;

      const list = body.children[0];
      if (!["UL", "OL"].includes(list.tagName)) return false;

      return Array.from(list.children).every(child => child.tagName === "LI");
    } catch {
      return false;
    }
  };

  const handleSave = async () => {
    if (!bibliografia.id) {
      showModal("Erro", "ID da bibliografia não encontrado. Não foi possível guardar.", "error");
      return;
    }

    if (!isValidListHTML(bibliografia.texto_html)) {
      showModal("Erro", "O conteúdo deve ser uma lista HTML válida (ul/ol > li).", "error");
      return;
    }

    if (!hasContentChanged(originalBibliografia, bibliografia)) {
      showModal("Sem Alterações", "Nenhuma alteração detetada. Nada foi salvo.", "info");
      return;
    }

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

    setLoading(true);
    try {
      const response = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/bibliografia/${bibliografia.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SESSION_TOKEN}`,
        },
        body: JSON.stringify({ texto_html: bibliografia.texto_html }),
      });

      if (!response.ok) throw new Error();

      showModal("Sucesso", "Bibliografia atualizada com sucesso.", "success");
      setOriginalBibliografia(bibliografia);
    } catch {
      showModal("Erro interno.", "Por favor, tente novamente mais tarde.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeTexto = (value) => {
    setBibliografia((prev) => ({ ...prev, texto_html: value }));
  };

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
          if (modal.type === "success") {
            window.location.reload();
          }
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
      <div className="container">
        <h2 className="title">Bibliografia</h2>
        <div className="bibliography-editor-wrapper">
          <ReactQuill
            value={bibliografia.texto_html}
            onChange={handleChangeTexto}
            theme="snow"
            className="bibliography-editor"
          />
        </div>
        <div className="column">
          <button className="saveButton" onClick={handleSave} disabled={loading}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default BibliographyB;
