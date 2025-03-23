import React, { useState } from "react";
import NavbarBackoffice from "../../../components/NavbarBackoffice";

function TeamB() {
    const [investigators, setInvestigators] = useState(['', '', '']); // Lista de investigadores iniciais (3 campos de texto)
    const [collaborators, setCollaborators] = useState(['', '', '']); // Lista de colaboradores iniciais (3 campos de texto)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false); // Controla a exibição do pop-up
    const [contactToRemove, setContactToRemove] = useState(null); // Guarda o índice do investigador ou colaborador a ser removido
    const [isInvestigator, setIsInvestigator] = useState(null); // Determina se o item a remover é um investigador ou colaborador
    const [contactName, setContactName] = useState(''); // Guarda o nome do investigador ou colaborador a ser removido

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

    // Função para exibir o pop-up de confirmação para Investigadores
    const confirmRemoveInvestigator = (index) => {
        setShowConfirmDialog(true);
        setContactToRemove(index);
        setIsInvestigator(true);
        setContactName(investigators[index]); // Definir o nome do investigador a ser removido
    };

    // Função para exibir o pop-up de confirmação para Colaboradores
    const confirmRemoveCollaborator = (index) => {
        setShowConfirmDialog(true);
        setContactToRemove(index);
        setIsInvestigator(false);
        setContactName(collaborators[index]); // Definir o nome do colaborador a ser removido
    };

    // Função para excluir um investigador
    const removeInvestigator = () => {
        const updatedInvestigators = investigators.filter((_, i) => i !== contactToRemove);
        setInvestigators(updatedInvestigators);
        setShowConfirmDialog(false); // Fecha o pop-up
        setContactToRemove(null); // Limpa o índice do investigador a ser removido
        setContactName(''); // Limpa o nome do investigador removido
    };

    // Função para excluir um colaborador
    const removeCollaborator = () => {
        const updatedCollaborators = collaborators.filter((_, i) => i !== contactToRemove);
        setCollaborators(updatedCollaborators);
        setShowConfirmDialog(false); // Fecha o pop-up
        setContactToRemove(null); // Limpa o índice do colaborador a ser removido
        setContactName(''); // Limpa o nome do colaborador removido
    };

    // Função para fechar o pop-up sem excluir
    const cancelRemoveContact = () => {
        setShowConfirmDialog(false);
        setContactToRemove(null);
        setContactName(''); // Limpa o nome
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
                                    onClick={() => confirmRemoveInvestigator(index)}
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
                                    onClick={() => confirmRemoveCollaborator(index)}
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
                            }}
                        >
                            Adicionar Colaborador
                        </button>
                    </div>
                </div>

                {/* Botão de Guardar */}
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
                        <h3>Tem a certeza que deseja apagar "{contactName}"?</h3>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <button
                                onClick={isInvestigator ? removeInvestigator : removeCollaborator}
                                style={{
                                    padding: '10px 20px', background: 'green', color: '#fff', border: 'none', borderRadius: '5px'
                                }}
                            >
                                Sim
                            </button>
                            <button
                                onClick={cancelRemoveContact}
                                style={{
                                    padding: '10px 20px', background: 'red', color: '#fff', border: 'none', borderRadius: '5px'
                                }}
                            >
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
