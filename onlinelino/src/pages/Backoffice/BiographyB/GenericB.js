import React, { useState } from "react";
import NavbarBackoffice from "../../../components/NavbarBackoffice";

function GenericB() {
    const [movies, setMovies] = useState([""]); // Lista para filmes
    const [links, setLinks] = useState([""]); // Lista para links
    const [showConfirmDialog, setShowConfirmDialog] = useState(false); // Controla a exibição do pop-up
    const [itemToRemove, setItemToRemove] = useState(null); // Armazena o tipo e índice do item a ser removido

    // Função para adicionar um novo filme
    const addMovieField = () => {
        setMovies([...movies, ""]);
    };

    // Função para adicionar um novo link
    const addLinkField = () => {
        setLinks([...links, ""]);
    };

    // Função para atualizar o valor de um filme
    const handleMovieChange = (index, value) => {
        const updatedMovies = [...movies];
        updatedMovies[index] = value;
        setMovies(updatedMovies);
    };

    // Função para atualizar o valor de um link
    const handleLinkChange = (index, value) => {
        const updatedLinks = [...links];
        updatedLinks[index] = value;
        setLinks(updatedLinks);
    };

    // Função para exibir o pop-up de confirmação para remover um filme
    const confirmRemoveItem = (type, index) => {
        setShowConfirmDialog(true);
        setItemToRemove({ type, index });
    };

    // Função para remover o filme ou link após confirmação
    const removeItem = () => {
        if (itemToRemove.type === 'movie') {
            setMovies(movies.filter((_, i) => i !== itemToRemove.index));
        } else if (itemToRemove.type === 'link') {
            setLinks(links.filter((_, i) => i !== itemToRemove.index));
        }
        setShowConfirmDialog(false); // Fecha o pop-up
        setItemToRemove(null); // Limpa o item a ser removido
    };

    // Função para fechar o pop-up sem remover
    const cancelRemoveItem = () => {
        setShowConfirmDialog(false);
        setItemToRemove(null);
    };

    return (
        <div>
            <NavbarBackoffice />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
                <h2 style={{ marginBottom: '20px' }}>GenericB</h2>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                    {/* Caixa de texto e botão para PORTUGUÊS */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                        <textarea
                            placeholder="Digite aqui em PORTUGUÊS.."
                            style={{
                                width: '50vh',
                                height: '20vh',
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

                    {/* Caixa de texto e botão para INGLÊS */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                        <textarea
                            placeholder="Digite aqui em INGLÊS..."
                            style={{
                                width: '50vh',
                                height: '20vh',
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

                {/* Seção de Filmes */}
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ width: '60%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                        <h2 style={{ marginBottom: '20px' }}>Filmes</h2>
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                            {movies.map((movie, index) => (
                                <div key={index} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                    <input
                                        type="text"
                                        value={movie}
                                        placeholder={`Filme ${index + 1}`}
                                        onChange={(e) => handleMovieChange(index, e.target.value)}
                                        style={{
                                            padding: '15px',
                                            borderRadius: '4px',
                                            border: '1px solid #ccc',
                                            width: '80%',
                                            maxWidth: '600px',
                                            fontSize: '16px'
                                        }}
                                    />
                                    <button
                                        onClick={() => confirmRemoveItem('movie', index)}
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
                                onClick={addMovieField}
                                style={{
                                    padding: '12px 24px',
                                    borderRadius: '4px',
                                    background: '#007BFF',
                                    color: '#fff',
                                    border: 'none',
                                    cursor: 'pointer',
                                    marginTop: '10px',
                                    fontSize: '16px',
                                    maxWidth: '250px',
                                    width: '100%',
                                    display: 'block',
                                    margin: '10px auto',
                                }}>
                                Adicionar Filme
                            </button>
                        </div>
                    </div>
                </div>

                {/* Seção de Outros Links */}
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ width: '60%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                        <h2 style={{ marginBottom: '20px' }}>Outros Links</h2>
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                            {links.map((link, index) => (
                                <div key={index} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                    <input
                                        type="text"
                                        value={link}
                                        placeholder={`Link ${index + 1}`}
                                        onChange={(e) => handleLinkChange(index, e.target.value)}
                                        style={{
                                            padding: '15px',
                                            borderRadius: '4px',
                                            border: '1px solid #ccc',
                                            width: '80%',
                                            maxWidth: '600px',
                                            fontSize: '16px'
                                        }}
                                    />
                                    <button
                                        onClick={() => confirmRemoveItem('link', index)}
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
                                onClick={addLinkField}
                                style={{
                                    padding: '12px 24px',
                                    borderRadius: '4px',
                                    background: '#007BFF',
                                    color: '#fff',
                                    border: 'none',
                                    cursor: 'pointer',
                                    marginTop: '10px',
                                    fontSize: '16px',
                                    maxWidth: '250px',
                                    width: '100%',
                                    display: 'block',
                                    margin: '10px auto',
                                }}>
                                Adicionar Link
                            </button>
                        </div>
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
                        <h3>Tem a certeza que deseja apagar?</h3>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <button
                                onClick={removeItem}
                                style={{
                                    padding: '10px 20px', background: 'green', color: '#fff', border: 'none', borderRadius: '5px'
                                }}>
                                Sim
                            </button>
                            <button
                                onClick={cancelRemoveItem}
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

export default GenericB;