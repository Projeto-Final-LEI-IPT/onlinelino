import React, { useState } from "react";
import NavbarBackoffice from "../../../components/NavbarBackoffice";
import "../../../style/Backoffice.css";

function TeamB() {
  const [collaborators, setCollaborators] = useState([{ name: "" }]);
  const [investigators, setInvestigators] = useState([{ name: "" }]);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [itemToRemove, setItemToRemove] = useState({ listType: null, index: null });
  const [itemNameToRemove, setItemNameToRemove] = useState("");

  const handleChange = (listType, index, value) => {
    const updatedList = listType === "collaborators" ? [...collaborators] : [...investigators];
    updatedList[index].name = value;

    if (listType === "collaborators") {
      setCollaborators(updatedList);
    } else {
      setInvestigators(updatedList);
    }
  };

  const addItem = (listType) => {
    const updatedList = listType === "collaborators" ? [...collaborators] : [...investigators];
    updatedList.push({ name: "" });

    if (listType === "collaborators") {
      setCollaborators(updatedList);
    } else {
      setInvestigators(updatedList);
    }
  };

  // Não remove imediatamente, apenas abre o diálogo
  const confirmRemoveItem = (listType, index) => {
    const name =
      listType === "collaborators" ? collaborators[index].name : investigators[index].name;
    setItemToRemove({ listType, index });
    setItemNameToRemove(name);
    setShowConfirmDialog(true);
  };

  // Remove só depois de confirmar
  const removeItem = () => {
    const { listType, index } = itemToRemove;

    if (listType === "collaborators") {
      const updated = collaborators.filter((_, i) => i !== index);
      setCollaborators(updated);
    } else if (listType === "investigators") {
      const updated = investigators.filter((_, i) => i !== index);
      setInvestigators(updated);
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

  return (
    <div>
      <NavbarBackoffice />
      <div className="container">
        <h2 className="title">TeamB</h2>

        <div className="contacts-list2">
          {/* Colaboradores */}
          <div className="column">
            <h3>Colaboradores</h3>
            {collaborators.map((item, index) => (
              <div key={index} className="contact-row" style={{ marginBottom: "10px" }}>
                <div className="contact-inputs">
                  <input
                    type="text"
                    className="contact-input"
                    placeholder={`Colaborador ${index + 1}`}
                    value={item.name}
                    onChange={(e) => handleChange("collaborators", index, e.target.value)}
                  />
                </div>
                <button
                  className="remove-button"
                  onClick={() => confirmRemoveItem("collaborators", index)}
                >
                  X
                </button>
              </div>
            ))}
            <button onClick={() => addItem("collaborators")} className="addButton">
              Adicionar Colaborador
            </button>
          </div>

          {/* Investigadores */}
          <div className="column">
            <h3>Investigadores</h3>
            {investigators.map((item, index) => (
              <div key={index} className="contact-row" style={{ marginBottom: "10px" }}>
                <div className="contact-inputs">
                  <input
                    type="text"
                    className="contact-input"
                    placeholder={`Investigador ${index + 1}`}
                    value={item.name}
                    onChange={(e) => handleChange("investigators", index, e.target.value)}
                  />
                </div>
                <button
                  className="remove-button"
                  onClick={() => confirmRemoveItem("investigators", index)}
                >
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
          <button className="saveButton">Guardar</button>
        </div>
      </div>

      {showConfirmDialog && (
        <div className="confirm-overlay">
          <div className="confirm-dialog">
            <h3>
              Tem a certeza que deseja apagar{" "}
              {itemToRemove.listType === "collaborators" ? "o colaborador" : "o investigador"} "
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
