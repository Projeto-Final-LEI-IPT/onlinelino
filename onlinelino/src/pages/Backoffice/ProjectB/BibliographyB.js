import React, { useState } from "react";
import NavbarBackoffice from "../../../components/NavbarBackoffice";

function BibliographyB() {
    const [contacts, setContacts] = useState([""]); // Lista com um único campo por item
    const [showConfirmDialog, setShowConfirmDialog] = useState(false); // Controla a exibição do pop-up
    const [contactToRemove, setContactToRemove] = useState(null); // Guarda o valor do contato a ser removido

    // Função para adicionar um novo campo
    const addContactField = () => {
        setContacts([...contacts, ""]);
    };

    // Função para atualizar o valor do campo
    const handleInputChange = (index, value) => {
        const updatedContacts = [...contacts];
        updatedContacts[index] = value;
        setContacts(updatedContacts);
    };

    // Função para exibir o pop-up de confirmação
    const confirmRemoveContact = (index) => {
        setShowConfirmDialog(true);
        setContactToRemove(index);
    };

    // Função para excluir o campo com base no índice
    const removeContact = () => {
        const updatedContacts = contacts.filter((_, i) => i !== contactToRemove);
        setContacts(updatedContacts);
        setShowConfirmDialog(false); // Fecha o pop-up
        setContactToRemove(null); // Limpa o índice do contato a ser removido
    };

    // Função para fechar o pop-up sem excluir
    const cancelRemoveContact = () => {
        setShowConfirmDialog(false);
        setContactToRemove(null);
    };

    return (
        <div>
            <NavbarBackoffice />
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '20px' }}>
                <div style={{ width: '60%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                    <h2 style={{ marginBottom: '20px' }}>BibliographyB</h2>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                        {/* Itera sobre a lista de contatos e renderiza um único campo para cada um */}
                        {contacts.map((contact, index) => (
                            <div key={index} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                {/* Campo único para cada tópico */}
                                <input
                                    type="text"
                                    value={contact}
                                    placeholder={`Tópico ${index + 1}`}
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                    style={{
                                        padding: '15px',
                                        borderRadius: '4px',
                                        border: '1px solid #ccc',
                                        width: '80%',
                                        maxWidth: '600px',
                                        fontSize: '16px'
                                    }}
                                />
                                {/* Botão de excluir */}
                                <button
                                    onClick={() => confirmRemoveContact(index)}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '4px',
                                        background: 'red',
                                        color: '#fff',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        fontSize: '18px',
                                        marginLeft: '10px'
                                    }}
                                >
                                    X
                                </button>
                            </div>
                        ))}

                        <button
                            onClick={addContactField}
                            style={{
                                padding: '12px 24px', borderRadius: '4px', background: '#007BFF', color: '#fff',
                                border: 'none',
                                cursor: 'pointer',
                                marginTop: '10px',
                                fontSize: '16px',
                                maxWidth: '250px',
                                width: '100%',
                                display: 'block',
                                margin: '10px auto',
                            }}>
                            Adicionar Tópico
                        </button>

                        {/* Botão de Guardar */}
                        <button style={{
                            padding: '10px 20px',
                            borderRadius: '4px',
                            background: '#007BFF',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            marginTop: '20px',
                            fontSize: '16px',
                            maxWidth: '250px',
                            width: '100%',
                            display: 'block',
                            margin: '10px auto',
                        }}>
                            Guardar
                        </button>
                    </div>
                </div>
            </div>

            {/* Pop-up de Confirmação */}
            {showConfirmDialog && (
                <div style={{
                    position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
                    background: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
                    zIndex: '1000'
                }}>
                    <div style={{
                        background: '#fff', padding: '20px', borderRadius: '5px', display: 'flex',
                        flexDirection: 'column', alignItems: 'center', maxWidth: '400px', width: '100%'
                    }}>
                        <h3>Tem a certeza que deseja apagar este tópico?</h3>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <button
                                onClick={removeContact}
                                style={{
                                    padding: '10px 20px', background: 'green', color: '#fff', border: 'none', borderRadius: '5px'
                                }}>
                                Sim
                            </button>
                            <button
                                onClick={cancelRemoveContact}
                                style={{
                                    padding: '10px 20px', background: 'red', color: '#fff', border: 'none', borderRadius: '5px'
                                }}>
                                Não
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BibliographyB;
