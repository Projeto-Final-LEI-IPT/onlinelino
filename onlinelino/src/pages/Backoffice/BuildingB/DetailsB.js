import React, { useState } from "react";
import NavbarBackoffice from "../../../components/NavbarBackoffice";
import ReactQuill from "react-quill"; // Importando ReactQuill
import "react-quill/dist/quill.snow.css"; // Importando o estilo do ReactQuill

function DetailsB() {
    const [images, setImages] = useState([]); // Estado para armazenar as imagens selecionadas

    // Função para lidar com o upload das imagens
    const handleImageUpload = (event) => {
        const files = event.target.files; // Pega todos os arquivos selecionados
        if (files) {
            const imageURLs = Array.from(files).map((file) =>
                URL.createObjectURL(file) // Cria URL local para cada imagem
            );
            setImages(imageURLs); // Armazena as URLs das imagens
        }
    };

    return (
        <div>
            <NavbarBackoffice />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
                <h2 style={{ marginBottom: '20px' }}>DetailsB</h2>

                {/* Seção para Título (PT e EN) */}
                <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', marginBottom: '50px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                        <label htmlFor="titulo-pt">Título (PT)</label>
                        <ReactQuill
                            id="titulo-pt"
                            style={{
                                width: '60vh', // Largura maior
                                height: '5vh',
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                        <label htmlFor="titulo-en">Título (EN)</label>
                        <ReactQuill
                            id="titulo-en"
                            style={{
                                width: '60vh', // Largura maior
                                height: '5vh',
                            }}
                        />
                    </div>
                </div>

                {/* Seção para Data de Construção (PT e EN) */}
                <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', marginBottom: '50px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                        <label htmlFor="data-pt">Data Construção (PT)</label>
                        <ReactQuill
                            id="data-pt"
                            style={{
                                width: '60vh', // Largura maior
                                height: '5vh',
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                        <label htmlFor="data-en">Data Construção (EN)</label>
                        <ReactQuill
                            id="data-en"
                            style={{
                                width: '60vh', // Largura maior
                                height: '5vh',
                            }}
                        />
                    </div>
                </div>

                {/* Seção para Tipo (PT e EN) */}
                <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', marginBottom: '50px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                        <label htmlFor="tipo-pt">Tipo (PT)</label>
                        <ReactQuill
                            id="tipo-pt"
                            style={{
                                width: '60vh', // Largura maior
                                height: '5vh',
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                        <label htmlFor="tipo-en">Tipo (EN)</label>
                        <ReactQuill
                            id="tipo-en"
                            style={{
                                width: '60vh', // Largura maior
                                height: '5vh',
                            }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                    <label htmlFor="localizacao">Localização</label>
                    <input
                        id="localizacao"
                        type="text"
                        style={{
                            width: '60vh',
                            height: '40px',
                            padding: '8px',
                            fontSize: '16px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                        }}
                    />
                </div>
                {/* Seção para Descrição (PT e EN) */}
                <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', marginBottom: '50px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                        <label htmlFor="descricao-pt">Descrição (PT)</label>
                        <ReactQuill
                            id="descricao-pt"
                            style={{
                                width: '60vh', // Largura maior
                                height: '15vh', // Maior altura
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                        <label htmlFor="descricao-en">Descrição (EN)</label>
                        <ReactQuill
                            id="descricao-en"
                            style={{
                                width: '60vh', // Largura maior
                                height: '15vh', // Maior altura
                            }}
                        />
                    </div>
                </div>

                {/* Seção para Legenda da Imagem (PT e EN) */}
                <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', marginBottom: '50px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                        <label htmlFor="legenda-pt">Legenda da Imagem (PT)</label>
                        <ReactQuill
                            id="legenda-pt"
                            style={{
                                width: '60vh', // Largura maior
                                height: '5vh',
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                        <label htmlFor="legenda-en">Legenda da Imagem (EN)</label>
                        <ReactQuill
                            id="legenda-en"
                            style={{
                                width: '60vh', // Largura maior
                                height: '5vh',
                            }}
                        />
                    </div>
                </div>

                {/* Seção de upload de múltiplas imagens */}
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload} // Função que lida com o upload
                        multiple // Permite o upload de múltiplas imagens
                        style={{
                            padding: '10px',
                            borderRadius: '4px',
                            background: '#28a745',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    />
                    {images.length > 0 && (
                        <div style={{ marginTop: '20px' }}>
                            <h4>Pré-visualização:</h4>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`Pré-visualização ${index + 1}`}
                                        style={{ maxWidth: '200px', maxHeight: '200px' }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DetailsB;
