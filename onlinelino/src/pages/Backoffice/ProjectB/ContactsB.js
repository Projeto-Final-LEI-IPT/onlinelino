import React, { useState, useEffect, useRef } from "react";
import NavbarBackoffice from "../../../components/NavbarBackoffice";
import "../../../style/Backoffice.css";
import '../../../style/Loading.css'
import { BACKOFFICE_URL, SERVER_URL, hasContentChanged } from "../../../Utils";
import ModalMessage from "../../../components/ModalMessage";
import { useAuthModalGuard } from "../../Backoffice/useAuthModalGuard";

function ContactsB() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState({
        open: false,
        title: "",
        message: "",
        type: "info",
        action: null,
    });
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [contactToRemove, setContactToRemove] = useState(null);
    const [contactNameToRemove, setContactNameToRemove] = useState("");
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [removedContactInfo, setRemovedContactInfo] = useState(null);
    const originalContacts = useRef([]);

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
    const SESSION_TOKEN = localStorage.getItem('authorization');

    const fetchContacts = async () => {
        if (!SESSION_TOKEN) return;
        setLoading(true);
        try {
            const response = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/contactos`, {
                method: "GET",
                headers: { Authorization: `Bearer ${SESSION_TOKEN}` },
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
            if (!response.ok) throw new Error("Erro ao buscar contactos");
            const data = await response.json();
            const normalized = data.map((contacto) => ({
                id: contacto.id,
                nome: contacto.nome || "",
                email: contacto.email || "",
                modificado_em: contacto.modificado_em || new Date().toISOString(),
            }));
            setContacts(normalized);
            originalContacts.current = normalized;
        } catch {
            showModal("Erro interno.", "Por favor, tente novamente mais tarde.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (authChecked) fetchContacts();
    }, [authChecked]);

    const addContactField = () => {
        setContacts((prev) => [
            ...prev,
            {
                id: `new-${Date.now()}`,
                nome: "",
                email: "",
                modificado_em: new Date().toISOString(),
            },
        ]);
    };

    const handleInputChange = (index, field, value) => {
        setContacts((prev) => {
            const updated = [...prev];
            updated[index][field] = value;
            updated[index].modificado_em = new Date().toISOString();
            return updated;
        });
    };

    const confirmRemoveContact = (index) => {
        const contact = contacts[index];
        if (String(contact.id).startsWith("new-")) {
            setRemovedContactInfo({ nome: contact.nome, email: contact.email });
            setContacts((prev) => prev.filter((_, i) => i !== index));
            showSuccessModal();
        } else {
            setShowConfirmDialog(true);
            setContactToRemove(index);
            setContactNameToRemove(contact.nome);
        }
    };

    const removeContact = async () => {
        if (contactToRemove === null) return;
        const contact = contacts[contactToRemove];
        if (!SESSION_TOKEN) {
            showModal(
                "Autenticação necessária",
                "Por favor, faça login para continuar.",
                "warning",
                () => window.location.assign("/backoffice/login")
            );
            resetConfirmDialog();
            return;
        }
        if (String(contact.id).startsWith("new-")) {
            setRemovedContactInfo({ nome: contact.nome, email: contact.email });
            setContacts((prev) => prev.filter((_, i) => i !== contactToRemove));
            resetConfirmDialog();
            showSuccessModal();
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/contactos/${contact.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${SESSION_TOKEN}` },
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
            if (!response.ok) throw new Error("Erro ao remover o contacto");
            setRemovedContactInfo({ nome: contact.nome, email: contact.email });
            setContacts((prev) => prev.filter((_, i) => i !== contactToRemove));
            showSuccessModal();
        } catch {
            showModal("Erro", "Erro ao remover o contacto. Por favor, tente novamente.", "error");
        } finally {
            resetConfirmDialog();
            setLoading(false);
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

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleSave = async () => {
        if (!SESSION_TOKEN) {
            showModal(
                "Autenticação necessária",
                "Por favor, faça login para continuar.",
                "warning",
                () => window.location.assign("/backoffice/login")
            );
            return;
        }
        if (!hasContentChanged(originalContacts.current, contacts)) {
            showModal("Sem Alterações", "Nenhuma alteração detetada. Nada foi salvo.", "info");
            return;
        }
        for (const c of contacts) {
            if (!c.nome.trim() || !c.email.trim()) {
                showModal("Erro", "Todos os contactos devem ter nome e email preenchidos.", "error");
                return;
            }
            if (!validateEmail(c.email)) {
                showModal("Erro", `Email inválido para o contacto "${c.nome}": ${c.email}`, "error");
                return;
            }
        }
        setLoading(true);
        try {
            const response = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/contactos`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${SESSION_TOKEN}`,
                },
                body: JSON.stringify(contacts),
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
            if (!response.ok) throw new Error("Erro ao guardar os contactos");
            showModal("Sucesso", "Contactos guardados com sucesso!", "success", () => window.location.reload());
        } catch {
            showModal("Erro interno.", "Por favor, tente novamente mais tarde.", "error");
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
                <h2 className="title">Contactos</h2>
                <div className="contacts-list">
                    {contacts.map((contact, index) => (
                        <div key={contact.id} className="contact-row">
                            <div className="contact-inputs">
                                <input
                                    type="text"
                                    value={contact.nome}
                                    placeholder={`Nome do Contacto ${index + 1}`}
                                    onChange={(e) => handleInputChange(index, "nome", e.target.value)}
                                    className="contact-input"
                                />
                                <input
                                    type="email"
                                    value={contact.email}
                                    placeholder={`Email do Contacto ${index + 1}`}
                                    onChange={(e) => handleInputChange(index, "email", e.target.value)}
                                    className="contact-input"
                                />
                            </div>
                            <button onClick={() => confirmRemoveContact(index)} className="remove-button">
                                X
                            </button>
                        </div>
                    ))}
                    <div className="column">
                        <button onClick={addContactField} className="addButton">
                            Adicionar Contacto
                        </button>
                        <button onClick={handleSave} className="saveButton" disabled={loading}>
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
                            <button onClick={removeContact} className="confirm-yes" disabled={loading}>
                                Sim
                            </button>
                            <button onClick={resetConfirmDialog} className="confirm-no" disabled={loading}>
                                Não
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showSuccessDialog && removedContactInfo && (
                <div className="confirm-overlay">
                    <div className="confirm-dialog">
                        <h3>Contacto removido com sucesso!</h3>
                        <p>
                            <strong>Nome:</strong> {removedContactInfo.nome}
                        </p>
                        <p>
                            <strong>Email:</strong> {removedContactInfo.email}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ContactsB;
