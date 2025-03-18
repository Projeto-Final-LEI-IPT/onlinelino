import React from "react";
import NavbarBackoffice from "../../../components/NavbarBackoffice";

function GenericB() {
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
                                width: '50vh', // Largura ajustada
                                height: '20vh', // Altura ajustada
                                padding: '10px',
                                borderRadius: '4px',
                                border: '1px solid #ccc',
                                resize: 'none', // Desabilita o redimensionamento
                                overflow: 'auto', // Adiciona scroll interno, se necessário
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

export default GenericB;
