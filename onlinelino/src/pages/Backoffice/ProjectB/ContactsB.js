import React, { useState } from "react";
import NavbarBackoffice from "../../../components/NavbarBackoffice";
import "../../../style/Backoffice.css"; 

function ContactsB() {
  const [contacts, setContacts] = useState([{ name: '', email: '' }]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [contactToRemove, setContactToRemove] = useState(null);
  const [contactNameToRemove, setContactNameToRemove] = useState('');

  const addContactField = () => {
    setContacts([...contacts, { name: '', email: '' }]);
  };

  const handleInputChange = (index, field, value) => {
    const updatedContacts = [...contacts];
    updatedContacts[index][field] = value;
    setContacts(updatedContacts);
  };

  const confirmRemoveContact = (index) => {
    setShowConfirmDialog(true);
    setContactToRemove(index);
    setContactNameToRemove(contacts[index].name);
  };

  const removeContact = () => {
    const updatedContacts = contacts.filter((_, i) => i !== contactToRemove);
    setContacts(updatedContacts);
    setShowConfirmDialog(false);
    setContactToRemove(null);
    setContactNameToRemove('');
  };

  const cancelRemoveContact = () => {
    setShowConfirmDialog(false);
    setContactToRemove(null);
    setContactNameToRemove('');
  };

  return (
    <div>
      <NavbarBackoffice />
      
        <div className="container">
          <h2 className="title">ContactsB</h2>
          <div className="contacts-list">
            {contacts.map((contact, index) => (
              <div key={index} className="contact-row">
                <div className="contact-inputs">
                  <input
                    type="text"
                    value={contact.name}
                    placeholder={`Nome do Contacto ${index + 1}`}
                    onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                    className="contact-input"
                  />
                  <input
                    type="email"
                    value={contact.email}
                    placeholder={`Email do Contacto ${index + 1}`}
                    onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                    className="contact-input"
                  />
                </div>
                <button
                  onClick={() => confirmRemoveContact(index)}
                  className="remove-button"
                >
                  X
                </button>
              </div>
            ))}
             <div className="column">
            <button onClick={addContactField} className="saveButton">
              Adicionar Contacto
            </button>
            <button className="saveButton">
              Guardar
            </button>
            </div>
          </div>
        </div>

      {showConfirmDialog && (
        <div className="confirm-overlay">
          <div className="confirm-dialog">
            <h3>Tem a certeza que deseja apagar o contacto "{contactNameToRemove}"?</h3>
            <div className="confirm-buttons">
              <button onClick={removeContact} className="confirm-yes">
                Sim
              </button>
              <button onClick={cancelRemoveContact} className="confirm-no">
                Não
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContactsB;
