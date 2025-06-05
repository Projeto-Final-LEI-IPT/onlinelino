import React, { useState, useEffect } from "react";
import NavbarBackoffice from "../../../components/NavbarBackoffice";
import "../../../style/Backoffice.css";
import { SERVER_URL, BACKOFFICE_URL } from "../../../Utils";

function TeamB() {
  const [collaborators, setCollaborators] = useState([]);
  const [investigators, setInvestigators] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [itemToRemove, setItemToRemove] = useState({ listType: null, index: null });
  const [itemNameToRemove, setItemNameToRemove] = useState("");
  const SESSION_TOKEN = localStorage.getItem("authorization");

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/equipa`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${SESSION_TOKEN}`,
        },
      });

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
    } catch (error) {
      alert(error.message);
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
    const updatedList = listType === "collaborators" ? [...collaborators, newItem] : [...investigators, newItem];

    if (listType === "collaborators") {
      setCollaborators(updatedList);
    } else {
      setInvestigators(updatedList);
    }
  };

  const confirmRemoveItem = (listType, index) => {
    const list = listType === "collaborators" ? collaborators : investigators;
    const name = list[index].nome.trim();

    if (name === "") {
      const updatedList = list.filter((_, i) => i !== index);
      if (listType === "collaborators") {
        setCollaborators(updatedList);
      } else {
        setInvestigators(updatedList);
      }
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

    if (String(item.id).startsWith("new-")) {
      const updated = list.filter((_, i) => i !== index);
      if (listType === "collaborators") setCollaborators(updated);
      else setInvestigators(updated);

      setShowConfirmDialog(false);
      setItemToRemove({ listType: null, index: null });
      setItemNameToRemove("");
      return;
    }

    try {
      const response = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/equipa/${item.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${SESSION_TOKEN}`,
        },
      });

      if (!response.ok) throw new Error("Erro ao apagar membro da equipa");

      const updated = list.filter((_, i) => i !== index);
      if (listType === "collaborators") setCollaborators(updated);
      else setInvestigators(updated);

      alert("Membro da equipa removido com sucesso!");
      window.location.reload();
    } catch (error) {
      alert(`Erro ao remover membro da equipa: ${error.message}`);
    }

    setShowConfirmDialog(false);
    setItemToRemove({ listType: null, index: null });
    setItemNameToRemove("");
  };

  const cancelRemove = () => {
    setShowConfirmDialog(false);
    setItemToRemove({ listType: null, index: null });
    setItemNameToRemove("");
  };

  const handleSave = async () => {
    for (const c of [...collaborators, ...investigators]) {
      if (!c.nome || c.nome.trim() === "") {
        alert("Todos os membros da equipa devem ter o campo 'nome' preenchido.");
        return;
      }
    }

    const allMembers = [...collaborators, ...investigators];
    try {
      const response = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/equipa`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SESSION_TOKEN}`,
        },
        body: JSON.stringify(allMembers),
      });
      if (!response.ok) throw new Error("Erro ao guardar a equipa");

      alert("Equipa guardada com sucesso!");
      window.location.reload();
    } catch (error) {
      alert(`Erro ao guardar: ${error.message}`);
    }
  };

  return (
    <div>
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
              <button onClick={removeItem} className="confirm-yes">
                Sim
              </button>
              <button onClick={cancelRemove} className="confirm-no">
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
