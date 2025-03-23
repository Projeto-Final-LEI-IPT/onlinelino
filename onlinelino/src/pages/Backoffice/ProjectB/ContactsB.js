import React, { useState } from "react";
import NavbarBackoffice from "../../../components/NavbarBackoffice";

function ContactsB() {
    const [contacts, setContacts] = useState([{ name: '', email: '' }]); // Lista de contatos com nome e email
    const [showConfirmDialog, setShowConfirmDialog] = useState(false); // Controla a exibição do pop-up
    const [contactToRemove, setContactToRemove] = useState(null); // Guarda o índice do contato a ser removido
    const [contactNameToRemove, setContactNameToRemove] = useState(''); // Guarda o nome do contato a ser removido

    // Função para adicionar um novo campo de contato
    const addContactField = () => {
        setContacts([...contacts, { name: '', email: '' }]);
    };

    // Função para atualizar o nome ou email de um contato na lista
    const handleInputChange = (index, field, value) => {
        const updatedContacts = [...contacts];
        updatedContacts[index][field] = value;
        setContacts(updatedContacts);
    };

    // Função para exibir o pop-up de confirmação para remover um contato
    const confirmRemoveContact = (index) => {
        setShowConfirmDialog(true);
        setContactToRemove(index);
        setContactNameToRemove(contacts[index].name); // Salva o nome do contato a ser removido
    };

    // Função para excluir o contato após confirmação
    const removeContact = () => {
        const updatedContacts = contacts.filter((_, i) => i !== contactToRemove);
        setContacts(updatedContacts);
        setShowConfirmDialog(false); // Fecha o pop-up
        setContactToRemove(null); // Limpa o índice do contato a ser removido
        setContactNameToRemove(''); // Limpa o nome do contato
    };

    // Função para fechar o pop-up sem excluir
    const cancelRemoveContact = () => {
        setShowConfirmDialog(false);
        setContactToRemove(null);
        setContactNameToRemove(''); // Limpa o nome do contato
    };

    return (
        <div>
            <NavbarBackoffice />
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '20px' }}>
                <div style={{ width: '60%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                    <h2 style={{ marginBottom: '20px' }}>ContactsB</h2>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {/* Itera sobre a lista de contatos e renderiza dois campos para cada um */}
                        {contacts.map((contact, index) => (
                            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                {/* Campos Nome e Email lado a lado */}
                                <div style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'center' }}>
                                    <input
                                        type="text"
                                        value={contact.name}
                                        placeholder={`Nome do Contacto ${index + 1}`}
                                        onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                                        style={{
                                            padding: '10px',
                                            borderRadius: '4px',
                                            border: '1px solid #ccc',
                                            width: '48%', // Aumento da largura
                                            maxWidth: '400px' // Aumento da largura máxima
                                        }}
                                    />
                                    <input
                                        type="email"
                                        value={contact.email}
                                        placeholder={`Email do Contacto ${index + 1}`}
                                        onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                                        style={{
                                            padding: '10px',
                                            borderRadius: '4px',
                                            border: '1px solid #ccc',
                                            width: '48%', // Aumento da largura
                                            maxWidth: '400px' // Aumento da largura máxima
                                        }}
                                    />
                                </div>
                                {/* Botão de excluir (X) ao lado dos inputs */}
                                <button
                                    onClick={() => confirmRemoveContact(index)}
                                    style={{
                                        width: '30px',
                                        height: '30px',
                                        borderRadius: '4px',
                                        background: 'red',
                                        color: '#fff',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        fontSize: '18px',
                                    }}
                                >
                                    X
                                </button>
                            </div>
                        ))}

                        <button 
                            onClick={addContactField}
                            style={{
                                padding: '10px 20px', borderRadius: '4px', background: '#007BFF', color: '#fff',
                                border: 'none',
                                cursor: 'pointer',
                                marginTop: '10px',
                                fontSize: '14px',
                                maxWidth: '200px',
                                width: '100%',
                                display: 'block',
                                margin: '10px auto',
                            }}>
                            Adicionar Contacto
                        </button>
                        {/* Botão de Guardar */}
                        <button style={{
                            padding: '8px 16px',
                            borderRadius: '4px',
                            background: '#007BFF',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                            marginTop: '20px',
                            fontSize: '14px',
                            maxWidth: '200px',
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
                        <h3>Tem a certeza que deseja apagar o contacto "{contactNameToRemove}"?</h3>
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

export default ContactsB;
