import React, { useState } from "react";
import NavbarBackoffice from "../../../components/NavbarBackoffice";

function TeamB() {
    const [investigators, setInvestigators] = useState(['', '', '']); // Lista de investigadores iniciais (3 campos de texto)
    const [collaborators, setCollaborators] = useState(['', '', '']); // Lista de colaboradores iniciais (3 campos de texto)

    // Função para adicionar mais campos de texto para Investigadores
    const addInvestigatorField = () => {
        setInvestigators([...investigators, '']);
    };

    // Função para adicionar mais campos de texto para Colaboradores
    const addCollaboratorField = () => {
        setCollaborators([...collaborators, '']);
    };

    // Função para atualizar o nome de um investigador na lista
    const handleInvestigatorChange = (index, value) => {
        const updatedInvestigators = [...investigators];
        updatedInvestigators[index] = value;
        setInvestigators(updatedInvestigators);
    };

    // Função para atualizar o nome de um colaborador na lista
    const handleCollaboratorChange = (index, value) => {
        const updatedCollaborators = [...collaborators];
        updatedCollaborators[index] = value;
        setCollaborators(updatedCollaborators);
    };

    // Função para excluir um investigador da lista
    const removeInvestigator = (index) => {
        const updatedInvestigators = investigators.filter((_, i) => i !== index);
        setInvestigators(updatedInvestigators);
    };

    // Função para excluir um colaborador da lista
    const removeCollaborator = (index) => {
        const updatedCollaborators = collaborators.filter((_, i) => i !== index);
        setCollaborators(updatedCollaborators);
    };

    return (
        <div>
            <NavbarBackoffice />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
                <h2 style={{ marginBottom: '20px' }}>TeamB</h2>
                <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', gap: '30px' }}>
                    {/* Lista de Investigadores */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h3>Investigadores</h3>
                        {investigators.map((investigator, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="text"
                                    value={investigator}
                                    placeholder={`Nome do Investigador ${index + 1}`}
                                    onChange={(e) => handleInvestigatorChange(index, e.target.value)}
                                    style={{
                                        width: '250px',
                                        padding: '10px',
                                        borderRadius: '4px',
                                        border: '1px solid #ccc',
                                    }}
                                />
                                {/* Botão de excluir (X) */}
                                <button
                                    onClick={() => removeInvestigator(index)}
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
                            onClick={addInvestigatorField}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '4px',
                                background: '#007BFF',
                                color: '#fff',
                                border: 'none',
                                cursor: 'pointer',
                                marginTop: '10px',
                            }}
                            >
                                Adicionar Investigador
                        </button>
                    </div>

                    {/* Lista de Colaboradores */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h3>Colaboradores</h3>
                        {collaborators.map((collaborator, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="text"
                                    value={collaborator}
                                    placeholder={`Nome do Colaborador ${index + 1}`}
                                    onChange={(e) => handleCollaboratorChange(index, e.target.value)}
                                    style={{
                                        width: '250px',
                                        padding: '10px',
                                        borderRadius: '4px',
                                        border: '1px solid #ccc',
                                    }}
                                />
                                {/* Botão de excluir (X) */}
                                <button
                                    onClick={() => removeCollaborator(index)}
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
                            onClick={addCollaboratorField}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '4px',
                                background: '#007BFF',
                                color: '#fff',
                                border: 'none',
                                cursor: 'pointer',
                                marginTop: '10px',
                            }}>
                            Adicionar Colaborador
                        </button>
                    </div>
                </div>
                {/* Botão de Guardar (Apenas exemplo, pode ser ajustado conforme sua necessidade) */}
                <button
                    style={{
                        padding: '10px 20px',
                        borderRadius: '4px',
                        background: '#007BFF',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        marginTop: '20px',
                    }}
                >
                    Guardar
                </button>
            </div>
        </div>
    );
}

export default TeamB;
