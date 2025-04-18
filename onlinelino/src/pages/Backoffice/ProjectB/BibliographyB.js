import React, { useState } from "react";
import NavbarBackoffice from "../../../components/NavbarBackoffice";
import ReactQuill from "react-quill"; // Importando o ReactQuill
import "react-quill/dist/quill.snow.css"; // Importando o estilo do ReactQuill

function BibliographyB() {
    // Inicializando o estado content

    return (
        <div>
            <NavbarBackoffice />
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '20px' }}>
                <div style={{ width: '60%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                    <h2 style={{ marginBottom: '20px' }}>BibliographyB</h2>
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* Editor Quill para a lista */}
                        <ReactQuill
                            theme="snow"
                            style={{
                                width: '1000px', // Largura fixa
                                height: '300px', // Altura fixa
                                marginBottom: '30px' // Adicionando marginBottom para mais espaçamento
                            }}
                        />
                    </div>

                    {/* Botão de Guardar */}
                    <button style={{
                        padding: '10px 20px',
                        borderRadius: '4px',
                        background: '#007BFF',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '16px',
                        maxWidth: '250px',
                        width: '100%',
                        display: 'block',
                        margin: '10px auto', // Ajustando o espaço de forma mais uniforme
                    }}>
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BibliographyB;
