import React, { useState } from "react";
import NavbarBackoffice from "../../../components/NavbarBackoffice";

function ContactsB() {
    const [contacts, setContacts] = useState([{ name: '', email: '' }]); // Lista de contatos com nome e email

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

    // Função para excluir um contato da lista
    const removeContact = (index) => {
        const updatedContacts = contacts.filter((_, i) => i !== index);
        setContacts(updatedContacts);
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
                                    onClick={() => removeContact(index)}
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
                        {/* Botão para adicionar um novo campo de contato */}
                        <button
                            onClick={addContactField}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '4px',
                            }}
                        />
                        <button style={{
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
                        }}
                        >
                            Guardar
                        </button>

                    </div>

                    {/* Caixa de texto e botão para INGLÊS */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                        <textarea
                            placeholder="Digite aqui em INGLÊS..."
                            style={{
                                width: '50vh', // Largura ajustada
                                height: '20vh', // Altura ajustada
                                padding: '10px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                resize: 'none',
                                overflow: 'auto',
                            }}
                        />
                        <button style={{ padding: '10px 20px', borderRadius: '4px', background: '#007BFF', color: '#fff', border: 'none', cursor: 'pointer' }}>
                            Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactsB;
