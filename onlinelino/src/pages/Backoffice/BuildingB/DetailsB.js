import React, { useState } from "react";
import NavbarBackoffice from "../../../components/NavbarBackoffice";

function DetailsB() {
    const [image, setImage] = useState(null); // Estado para armazenar a imagem selecionada

    // Função para lidar com o upload da imagem
    const handleImageUpload = (event) => {
        const file = event.target.files[0]; // Pega o primeiro arquivo selecionado
        if (file) {
            setImage(URL.createObjectURL(file)); // Armazena a URL da imagem localmente para pré-visualização
        }
    };

    return (
        <div>
            <NavbarBackoffice />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
                <h2 style={{ marginBottom: '20px' }}>DetailsB</h2>

                {/* Seção para Título (PT e EN) */}
                <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                        <label htmlFor="titulo-pt">Título (PT)</label>
                        <textarea
                            id="titulo-pt"
                            placeholder="Digite o título em Português"
                            style={{
                                width: '50vh',
                                height: '5vh',
                                padding: '10px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                resize: 'none',
                                overflow: 'auto',
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                        <label htmlFor="titulo-en">Título (EN)</label>
                        <textarea
                            id="titulo-en"
                            placeholder="Digite o título em Inglês"
                            style={{
                                width: '50vh',
                                height: '5vh',
                                padding: '10px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                resize: 'none',
                                overflow: 'auto',
                            }}
                        />
                    </div>
                </div>

                {/* Seção para Descrição (PT e EN) */}
                <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                        <label htmlFor="descricao-pt">Descrição (PT)</label>
                        <textarea
                            id="descricao-pt"
                            placeholder="Digite a descrição em Português"
                            style={{
                                width: '50vh',
                                height: '10vh',
                                padding: '10px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                resize: 'none',
                                overflow: 'auto',
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                        <label htmlFor="descricao-en">Descrição (EN)</label>
                        <textarea
                            id="descricao-en"
                            placeholder="Digite a descrição em Inglês"
                            style={{
                                width: '50vh',
                                height: '10vh',
                                padding: '10px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                resize: 'none',
                                overflow: 'auto',
                            }}
                        />
                    </div>
                </div>

                {/* Seção para Legenda da Imagem (PT e EN) */}
                <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                        <label htmlFor="legenda-pt">Legenda da Imagem (PT)</label>
                        <textarea
                            id="legenda-pt"
                            placeholder="Digite a legenda da imagem em Português"
                            style={{
                                width: '50vh',
                                height: '5vh',
                                padding: '10px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                resize: 'none',
                                overflow: 'auto',
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                        <label htmlFor="legenda-en">Legenda da Imagem (EN)</label>
                        <textarea
                            id="legenda-en"
                            placeholder="Digite a legenda da imagem em Inglês"
                            style={{
                                width: '50vh',
                                height: '5vh',
                                padding: '10px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                resize: 'none',
                                overflow: 'auto',
                            }}
                        />
                    </div>
                </div>

                {/* Seção de upload de imagem */}
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload} // Função que lida com o upload
                        style={{
                            padding: '10px',
                            borderRadius: '4px',
                            background: '#28a745',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    />
                    {image && (
                        <div style={{ marginTop: '20px' }}>
                            <h4>Pré-visualização:</h4>
                            <img src={image} alt="Pré-visualização" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DetailsB;
