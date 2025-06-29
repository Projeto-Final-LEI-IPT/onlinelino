import React, { useState, useEffect, useRef } from "react";
import NavbarBackoffice from "../../../components/NavbarBackoffice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../../style/Backoffice.css";
import "../../../style/Loading.css";
import { BACKOFFICE_URL, SERVER_URL, hasContentChanged } from "../../../Utils";
import ModalMessage from "../../../components/ModalMessage";
import { useAuthModalGuard } from "../../Backoffice/useAuthModalGuard";

const STRUCTURE_TEMPLATE = `
  <p><br></p>
  <h4>Filmes</h4>
  <ul>
    <li><a href=""><br></a></li>
  </ul>
  <h4>Outros links</h4>
  <ul>
    <li><a href=""><br></a></li>
  </ul>
`;

const isStructureValid = (html) => {
  try {
    const doc = new DOMParser().parseFromString(`<div>${html}</div>`, "text/html");
    const container = doc.body.firstChild;

    const children = Array.from(container.children);
    if (children.length !== 5) return false;

    const [p, h4Filmes, ulFilmes, h4Links, ulLinks] = children;

    return (
      p.tagName === "P" &&
      h4Filmes.tagName === "H4" && h4Filmes.textContent.trim().toLowerCase() === "filmes" &&
      ulFilmes.tagName === "UL" &&
      h4Links.tagName === "H4" && h4Links.textContent.trim().toLowerCase() === "outros links" &&
      ulLinks.tagName === "UL"
    );
  } catch {
    return false;
  }
};

function GenericB() {
  const [contentPT, setContentPT] = useState(STRUCTURE_TEMPLATE);
  const [contentEN, setContentEN] = useState(STRUCTURE_TEMPLATE);
  const [overviewId, setOverviewId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    open: false,
    title: "",
    message: "",
    type: "info",
    action: null,
  });

  const originalContentPT = useRef(STRUCTURE_TEMPLATE);
  const originalContentEN = useRef(STRUCTURE_TEMPLATE);

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

    const fetchOverview = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/overview`, {
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

        if (!response.ok) throw new Error("Erro ao buscar dados");

        const data = await response.json();

        if (data.length > 0) {
          const item = data[0];
          const ptContent = item.descricao_pt || STRUCTURE_TEMPLATE;
          const enContent = item.descricao_en || STRUCTURE_TEMPLATE;

          setContentPT(ptContent);
          setContentEN(enContent);
          setOverviewId(item.id);

          originalContentPT.current = ptContent;
          originalContentEN.current = enContent;
        } else {
          setContentPT(STRUCTURE_TEMPLATE);
          setContentEN(STRUCTURE_TEMPLATE);
          setOverviewId(null);

          originalContentPT.current = STRUCTURE_TEMPLATE;
          originalContentEN.current = STRUCTURE_TEMPLATE;
        }
      } catch (err) {
        showModal("Erro", "Erro interno. Por favor, tente novamente mais tarde.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [authChecked]);

  const handleSave = async () => {
    if (!overviewId) {
      showModal("Erro", "ID não encontrado, impossível salvar.", "error");
      return;
    }

    if (!hasContentChanged(
      { descricao_pt: originalContentPT.current, descricao_en: originalContentEN.current },
      { descricao_pt: contentPT, descricao_en: contentEN }
    )) {
      showModal("Sem Alterações", "Nenhuma alteração detetada. Nada foi salvo.", "info");
      return;
    }

    if (!isStructureValid(contentPT) || !isStructureValid(contentEN)) {
      showModal("Erro", "Estrutura inválida. Por favor, não altere a estrutura base do conteúdo.", "error");
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
      const response = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/overview/${overviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SESSION_TOKEN}`,
        },
        body: JSON.stringify({
          descricao_pt: contentPT,
          descricao_en: contentEN,
        }),
      });

      if (!response.ok) throw new Error();

      showModal("Sucesso", "Conteúdo salvo com sucesso!", "success");
      originalContentPT.current = contentPT;
      originalContentEN.current = contentEN;
    } catch {
      showModal("Erro", "Erro interno. Por favor, tente novamente mais tarde.", "error");
    } finally {
      setLoading(false);
    }
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
        <h2 className="title">Visão Geral</h2>
        <div className="row">
          <div className="column">
            <h3>Português</h3>
            <ReactQuill
              theme="snow"
              value={contentPT}
              onChange={setContentPT}
              className="quillEditor"
            />
          </div>
          <div className="column">
            <h3>Inglês</h3>
            <ReactQuill
              theme="snow"
              value={contentEN}
              onChange={setContentEN}
              className="quillEditor"
            />
          </div>
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

export default GenericB;
