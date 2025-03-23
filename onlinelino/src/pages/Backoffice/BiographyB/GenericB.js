import React, { useState } from "react";
import NavbarBackoffice from "../../../components/NavbarBackoffice";

function GenericB() {
    const [movies, setMovies] = useState([""]); // Lista para filmes
    const [links, setLinks] = useState([""]); // Lista para links

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

    // Função para remover um filme
    const removeMovie = (index) => {
        setMovies(movies.filter((_, i) => i !== index));
    };

    // Função para remover um link
    const removeLink = (index) => {
        setLinks(links.filter((_, i) => i !== index));
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
                                        onClick={() => removeMovie(index)}
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
                                        onClick={() => removeLink(index)}
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
        </div>
    );
}

export default GenericB;
