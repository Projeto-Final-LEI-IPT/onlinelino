import React, { useState, useEffect, useRef } from "react";
import NavbarBackoffice from "../../../components/NavbarBackoffice";
import "../../../style/Backoffice.css";
import "../../../style/Loading.css";
import { SERVER_URL, BACKOFFICE_URL, hasContentChanged } from "../../../Utils";
import ModalMessage from "../../../components/ModalMessage";
import { useAuthModalGuard } from "../../Backoffice/useAuthModalGuard";

function TeamB() {
  const [collaborators, setCollaborators] = useState([]);
  const [investigators, setInvestigators] = useState([]);
  const originalCollaborators = useRef([]);
  const originalInvestigators = useRef([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [itemToRemove, setItemToRemove] = useState({ listType: null, index: null });
  const [itemNameToRemove, setItemNameToRemove] = useState("");
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ open: false, title: "", message: "", type: "info", action: null });

  const SESSION_TOKEN = localStorage.getItem("authorization");
  const authChecked = useAuthModalGuard(showModal);

  function showModal(title, message, type = "info", actionCallback = null) {
    setModal({
      open: true,
      title,
      message,
      type,
      action: actionCallback ? { label: "Login", onClick: actionCallback } : null,
    });
  }

  useEffect(() => {
    if (authChecked) fetchTeamMembers();
  }, [authChecked]);

  const fetchTeamMembers = async () => {
    if (!SESSION_TOKEN) return;
    setLoading(true);
    try {
      const response = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/equipa`, {
        method: "GET",
        headers: { Authorization: `Bearer ${SESSION_TOKEN}` },
      });

      if (response.status === 401) {
        showModal(
          "Sessão expirada",
          "Por favor, faça login novamente.",
          "warning",
          () => (window.location.href = "/backoffice/login")
        );
        return;
      }

      if (!response.ok) throw new Error("Erro ao buscar dados da equipa");

      const data = await response.json();

      const colaboradores = data
        .filter((item) => item.cargo === "Colaborador")
        .map((item) => ({
          id: item.id || "",
          nome: item.nome || "",
          cargo: item.cargo,
          modificado_em: item.modificado_em || "",
        }));

      const investigadores = data
        .filter((item) => item.cargo === "Investigador")
        .map((item) => ({
          id: item.id || "",
          nome: item.nome || "",
          cargo: item.cargo,
          modificado_em: item.modificado_em || "",
        }));

      setCollaborators(colaboradores);
      setInvestigators(investigadores);
      originalCollaborators.current = colaboradores;
      originalInvestigators.current = investigadores;
    } catch (error) {
      showModal("Erro", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (listType, index, value) => {
    const updatedList = listType === "collaborators" ? [...collaborators] : [...investigators];
    if (updatedList[index].nome === value) return;

    updatedList[index] = {
      ...updatedList[index],
      nome: value,
      modificado_em: new Date().toISOString(),
    };

    if (listType === "collaborators") {
      setCollaborators(updatedList);
    } else {
      setInvestigators(updatedList);
    }
  };

  const addItem = (listType) => {
    const newItem = {
      id: `new-${Date.now()}`,
      nome: "",
      cargo: listType === "collaborators" ? "Colaborador" : "Investigador",
      modificado_em: new Date().toISOString(),
    };
    if (listType === "collaborators") setCollaborators((prev) => [...prev, newItem]);
    else setInvestigators((prev) => [...prev, newItem]);
  };

  const confirmRemoveItem = (listType, index) => {
    const list = listType === "collaborators" ? collaborators : investigators;
    const name = list[index].nome.trim();

    if (name === "") {
      const updatedList = list.filter((_, i) => i !== index);
      if (listType === "collaborators") setCollaborators(updatedList);
      else setInvestigators(updatedList);
      return;
    }
    setItemToRemove({ listType, index });
    setItemNameToRemove(list[index].nome);
    setShowConfirmDialog(true);
  };

  const removeItem = async () => {
    const { listType, index } = itemToRemove;
    const list = listType === "collaborators" ? collaborators : investigators;
    const item = list[index];

    if (!SESSION_TOKEN) {
      showModal(
        "Autenticação necessária",
        "Por favor, faça login para continuar.",
        "warning",
        () => (window.location.href = "/backoffice/login")
      );
      resetRemoveDialog();
      return;
    }

    if (String(item.id).startsWith("new-")) {
      const updated = list.filter((_, i) => i !== index);
      if (listType === "collaborators") setCollaborators(updated);
      else setInvestigators(updated);

      resetRemoveDialog();
      showModal("Sucesso", `Membro da equipa "${item.nome}" removido com sucesso!`, "success");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/equipa/${item.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${SESSION_TOKEN}` },
      });

      if (response.status === 401) {
        showModal(
          "Sessão expirada",
          "Por favor, faça login novamente.",
          "warning",
          () => (window.location.href = "/backoffice/login")
        );
        return;
      }

      if (!response.ok) throw new Error("Erro ao apagar membro da equipa");

      const updated = list.filter((_, i) => i !== index);
      if (listType === "collaborators") setCollaborators(updated);
      else setInvestigators(updated);

      showModal("Sucesso", `Membro da equipa "${item.nome}" removido com sucesso!`, "success");
    } catch (error) {
      showModal("Erro", `Erro ao remover membro da equipa: ${error.message}`, "error");
    } finally {
      resetRemoveDialog();
      setLoading(false);
    }
  };

  const resetRemoveDialog = () => {
    setShowConfirmDialog(false);
    setItemToRemove({ listType: null, index: null });
    setItemNameToRemove("");
  };

  const handleSave = async () => {
    if (!SESSION_TOKEN) {
      showModal(
        "Autenticação necessária",
        "Por favor, faça login para continuar.",
        "warning",
        () => (window.location.href = "/backoffice/login")
      );
      return;
    }

    for (const c of [...collaborators, ...investigators]) {
      if (!c.nome || c.nome.trim() === "") {
        showModal("Erro", "Todos os membros da equipa devem ter o campo 'nome' preenchido.", "error");
        return;
      }
    }

    const hasChanges =
      hasContentChanged(originalCollaborators.current, collaborators) ||
      hasContentChanged(originalInvestigators.current, investigators);

    if (!hasChanges) {
      showModal("Sem alterações", "Nenhuma alteração detetada. Nada foi salvo.", "info");
      return;
    }

    const allMembers = [...collaborators, ...investigators];
    setLoading(true);
    try {
      const response = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/equipa`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SESSION_TOKEN}`,
        },
        body: JSON.stringify(allMembers),
      });
      if (response.status === 401) {
        showModal(
          "Sessão expirada",
          "Por favor, faça login novamente.",
          "warning",
          () => (window.location.href = "/backoffice/login")
        );
        return;
      }
      if (!response.ok) throw new Error("Erro ao guardar a equipa");

      showModal("Sucesso", "Equipa guardada com sucesso!", "success", () => window.location.reload());
    } catch (error) {
      showModal("Erro", `Erro ao guardar: ${error.message}`, "error");
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
      <div className="container">
        <h2 className="title">Equipa</h2>
        <div className="contacts-list2">
          <div className="column">
            <h3>Colaboradores</h3>
            {collaborators.map((item, index) => (
              <div key={item.id} className="contact-row" style={{ marginBottom: "10px" }}>
                <div className="contact-inputs">
                  <input
                    type="text"
                    className="contact-input"
                    placeholder={`Colaborador ${index + 1}`}
                    value={item.nome}
                    onChange={(e) => handleChange("collaborators", index, e.target.value)}
                  />
                </div>
                <button className="remove-button" onClick={() => confirmRemoveItem("collaborators", index)}>
                  X
                </button>
              </div>
            ))}
            <button onClick={() => addItem("collaborators")} className="addButton">
              Adicionar Colaborador
            </button>
          </div>

          <div className="column">
            <h3>Investigadores</h3>
            {investigators.map((item, index) => (
              <div key={item.id} className="contact-row" style={{ marginBottom: "10px" }}>
                <div className="contact-inputs">
                  <input
                    type="text"
                    className="contact-input"
                    placeholder={`Investigador ${index + 1}`}
                    value={item.nome}
                    onChange={(e) => handleChange("investigators", index, e.target.value)}
                  />
                </div>
                <button className="remove-button" onClick={() => confirmRemoveItem("investigators", index)}>
                  X
                </button>
              </div>
            ))}
            <button onClick={() => addItem("investigators")} className="addButton">
              Adicionar Investigador
            </button>
          </div>
        </div>

        <div className="column">
          <button onClick={handleSave} className="saveButton">
            Guardar
          </button>
        </div>
      </div>

      {showConfirmDialog && (
        <div className="confirm-overlay">
          <div className="confirm-dialog">
            <h3>
              Tem a certeza que deseja apagar {itemToRemove.listType === "collaborators" ? "o colaborador" : "o investigador"} "
              {itemNameToRemove}"?
            </h3>
            <div className="confirm-buttons">
              <button onClick={removeItem} className="confirm-yes" disabled={loading}>
                Sim
              </button>
              <button onClick={resetRemoveDialog} className="confirm-no" disabled={loading}>
                Não
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamB;
