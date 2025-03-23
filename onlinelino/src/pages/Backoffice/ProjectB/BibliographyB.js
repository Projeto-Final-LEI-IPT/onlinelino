import React, { useState } from "react";
import NavbarBackoffice from "../../../components/NavbarBackoffice";

function BibliographyB() {
    const [contacts, setContacts] = useState([""]); // Lista com um único campo por item

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

    // Função para excluir um campo da lista
    const removeContact = (index) => {
        const updatedContacts = contacts.filter((_, i) => i !== index);
        setContacts(updatedContacts);
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
                                {/* Campo único para cada topico */}
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
                                    onClick={() => removeContact(index)}
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
        </div>
    );
}

export default BibliographyB;
