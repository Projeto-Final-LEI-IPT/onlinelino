import React, { useState, useEffect } from "react";
import NavbarBackoffice from "../../../components/NavbarBackoffice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../../style/Backoffice.css";
import "../../../style/Loading.css";
import { BACKOFFICE_URL, SERVER_URL, hasContentChanged } from "../../../Utils";
import { HomePageDO } from "../../../server/Models/DataObjects";
import ModalMessage from "../../../components/ModalMessage.js";
import { useAuthModalGuard } from "../../Backoffice/useAuthModalGuard";

function DescriptionB() {
  const [descricao, setDescricao] = useState(HomePageDO);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({
    open: false,
    title: '',
    message: '',
    type: 'info',
    action: null,
  });

  const [originalDescricao, setOriginalDescricao] = useState(HomePageDO);

  const showModal = (title, message, type = 'info', actionCallback = null) => {
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

    const fetchDescricao = async () => {
      setLoading(true);
      const SESSION_TOKEN = localStorage.getItem('authorization');
      try {
        const res = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/descricao`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${SESSION_TOKEN}`,
          }
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        if (data.length > 0) {
          const loaded = { ...HomePageDO, ...data[0] };
          setDescricao(loaded);
          setOriginalDescricao(loaded);
        }
      } catch (err) {
        showModal("Erro interno.", "Por favor, tente novamente mais tarde.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchDescricao();
  }, [authChecked]);

  const handleSave = async () => {
    if (!hasContentChanged(originalDescricao, descricao)) {
      showModal("Sem Alterações", "Nenhuma alteração detetada. Nada foi salvo.", "info");
      return;
    }

    const SESSION_TOKEN = localStorage.getItem('authorization');
    const updated = { ...descricao, modificado_em: new Date().toISOString() };

    try {
      const res = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/descricao/${updated.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SESSION_TOKEN}`,
        },
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error();
      showModal("Sucesso", "Descrição atualizada com sucesso.", "success");
    } catch {
      showModal("Erro interno.", "Por favor, tente novamente mais tarde.", "error");
    }
  };

  const handleChange = (lang) => (value) =>
    setDescricao((prev) => ({ ...prev, [`descricao_${lang}`]: value }));

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
        onClose={() => setModal((m) => ({ ...m, open: false }))}
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
        <h2 className="title">Descrição</h2>
        <div className="row">
          <div className="column">
            <h3>Português</h3>
            <ReactQuill
              value={descricao.descricao_pt}
              onChange={handleChange("pt")}
              theme="snow"
              className="quillEditor"
            />
          </div>
          <div className="column">
            <h3>Inglês</h3>
            <ReactQuill
              value={descricao.descricao_en}
              onChange={handleChange("en")}
              theme="snow"
              className="quillEditor"
            />
          </div>
        </div>
        <div className="column">
          <button className="saveButton" onClick={handleSave}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default DescriptionB;
