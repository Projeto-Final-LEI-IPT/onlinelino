import React, { useState, useEffect } from "react";
import NavbarBackoffice from "../../../components/NavbarBackoffice";
import "../../../style/Backoffice.css";
import { BACKOFFICE_URL, SERVER_URL } from "../../../Utils";

function ContactsB() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [contactToRemove, setContactToRemove] = useState(null);
    const [contactNameToRemove, setContactNameToRemove] = useState("");
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [removedContactInfo, setRemovedContactInfo] = useState(null);
    const SESSION_TOKEN = localStorage.getItem('authorization');

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/contactos`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${SESSION_TOKEN}`,
                }
            });
            if (!response.ok) throw new Error("Erro ao buscar contactos");
            const data = await response.json();

            const normalized = data.map((contacto) => ({
                id: contacto.id,
                nome: contacto.nome || "",
                email: contacto.email || "",
                modificado_em: contacto.modificado_em || new Date().toISOString()
            }));

            setContacts(normalized);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const addContactField = () => {
        setContacts([...contacts, {
            id: `new-${Date.now()}`,
            nome: "",
            email: "",
            modificado_em: new Date().toISOString()
        }]);
    };

    const handleInputChange = (index, field, value) => {
        const updatedContacts = [...contacts];
        updatedContacts[index][field] = value;
        updatedContacts[index].modificado_em = new Date().toISOString();
        setContacts(updatedContacts);
    };

    const confirmRemoveContact = (index) => {
    const contact = contacts[index];

    if (String(contact.id).startsWith("new-")) {
        setRemovedContactInfo({ nome: contact.nome, email: contact.email });
        setContacts(contacts.filter((_, i) => i !== index));
    } else {
        setShowConfirmDialog(true);
        setContactToRemove(index);
        setContactNameToRemove(contact.nome);
    }
};


    const removeContact = async () => {
        const contact = contacts[contactToRemove];

        if (String(contact.id).startsWith("new-")) {
            setRemovedContactInfo({ nome: contact.nome, email: contact.email });
            setContacts(contacts.filter((_, i) => i !== contactToRemove));
            resetConfirmDialog();
            showSuccessModal();
            return;
        }

        try {
            const response = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/contactos/${contact.id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${SESSION_TOKEN}`
                }
            });

            if (!response.ok) throw new Error("Erro ao remover o contacto");

            setRemovedContactInfo({ nome: contact.nome, email: contact.email });
            resetConfirmDialog();
            showSuccessModal();
        } catch (err) {
            alert(`Erro ao remover contacto: ${err.message}`);
            resetConfirmDialog();
        }
    };

    const resetConfirmDialog = () => {
        setShowConfirmDialog(false);
        setContactToRemove(null);
        setContactNameToRemove("");
    };

    const showSuccessModal = () => {
        setShowSuccessDialog(true);
        setTimeout(async () => {
            setShowSuccessDialog(false);
            await fetchContacts();
        }, 3000);
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleSave = async () => {
    for (let c of contacts) {
        const nomeValido = c.nome && c.nome.trim() !== "";
        const emailValido = c.email && c.email.trim() !== "";

        if (!nomeValido || !emailValido) {
            alert("Todos os contactos devem ter nome e email preenchidos.");
            return;
        }

        if (!validateEmail(c.email)) {
            alert(`Email inválido para o contacto "${c.nome}": ${c.email}`);
            return;
        }
    }

    try {
        const response = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/contactos`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${SESSION_TOKEN}`,
            },
            body: JSON.stringify(contacts),
        });

        if (!response.ok) throw new Error("Erro ao guardar os contactos");
        alert("Contactos guardados com sucesso!");
        window.location.reload();
    } catch (err) {
        alert(`Erro: ${err.message}`);
    }
};



    if (loading) return <p>A carregar contactos...</p>;
    if (error) return <p className="text-red-500">Erro: {error}</p>;

    return (
        <div>
            <NavbarBackoffice />
            <div className="container">
                <h2 className="title">Contactos</h2>
                <div className="contacts-list">
                    {contacts.map((contact, index) => (
                        <div key={contact.id} className="contact-row">
                            <div className="contact-inputs">
                                <input
                                    type="text"
                                    value={contact.nome}
                                    placeholder={`Nome do Contacto ${index + 1}`}
                                    onChange={(e) => handleInputChange(index, 'nome', e.target.value)}
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
                            <button onClick={() => confirmRemoveContact(index)} className="remove-button">
                                X
                            </button>
                        </div>
                    ))}
                    <div className="column">
                        <button onClick={addContactField} className="addButton">Adicionar Contacto</button>
                        <button onClick={handleSave} className="saveButton">Guardar</button>
                    </div>
                </div>
            </div>

            {showConfirmDialog && (
                <div className="confirm-overlay">
                    <div className="confirm-dialog">
                        <h3>Tem a certeza que deseja apagar o contacto "{contactNameToRemove}"?</h3>
                        <div className="confirm-buttons">
                            <button onClick={removeContact} className="confirm-yes">Sim</button>
                            <button onClick={resetConfirmDialog} className="confirm-no">Não</button>
                        </div>
                    </div>
                </div>
            )}
            {showSuccessDialog && removedContactInfo && (
                <div className="confirm-overlay">
                    <div className="confirm-dialog">
                        <h3>Contacto removido com sucesso!</h3>
                        <p><strong>Nome:</strong> {removedContactInfo.nome}</p>
                        <p><strong>Email:</strong> {removedContactInfo.email}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ContactsB;
