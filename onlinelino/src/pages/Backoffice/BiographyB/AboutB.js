import React from "react";
import NavbarBackoffice from "../../../components/NavbarBackoffice";
import ReactQuill from "react-quill"; // Importando ReactQuill
import "react-quill/dist/quill.snow.css"; // Importando o estilo do ReactQuill

function AboutB() {
    return (
        <div>
            <NavbarBackoffice />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
                <h2 style={{ marginBottom: '20px' }}>AboutB</h2>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
                    {/* Caixa de texto e botão para PORTUGUÊS */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                        <ReactQuill
                            value="<p>Texto em português...</p>"
                            theme="snow"
                            style={{
                                width: '500px', 
                                height: '300px', 
                            }}
                        />
                        <button
                            style={{
                                marginTop: '50px',
                                padding: '10px 20px',
                                borderRadius: '4px',
                                background: '#007BFF',
                                color: '#fff',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            Guardar
                        </button>
                    </div>

                    {/* Caixa de texto e botão para INGLÊS */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                        <ReactQuill
                            value="<p>Text in English...</p>"
                            theme="snow"
                            style={{
                                width: '500px', // Largura fixa
                                height: '300px', // Altura fixa
                            }}
                        />
                        <button
                            style={{
                                marginTop: '50px', // Adicionando margem para separar o botão do Quill
                                padding: '10px 20px',
                                borderRadius: '4px',
                                background: '#007BFF',
                                color: '#fff',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            Guardar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutB;
