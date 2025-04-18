import React, { useState } from "react";
import NavbarBackoffice from "../../../components/NavbarBackoffice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function TeamB() {
    const [collaboratorsText, setCollaboratorsText] = useState('');
    const [investigatorsText, setInvestigatorsText] = useState('');

    return (
        <div>
            <NavbarBackoffice />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
                <h2 style={{ marginBottom: '30px' }}>TeamB</h2>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', width: '100%', marginBottom: '50px' }}>
                    {/* Colaboradores */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h3>Colaboradores</h3>
                        <ReactQuill
                            value={collaboratorsText}
                            onChange={setCollaboratorsText}
                            style={{ 
                                width: '500px', // Largura fixa
                                height: '300px', // Altura fixa
                            }}
                        />
                    </div>

                    {/* Investigadores */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h3>Investigadores</h3>
                        <ReactQuill
                            value={investigatorsText}
                            onChange={setInvestigatorsText}
                            style={{ 
                                width: '500px', // Largura fixa
                                height: '300px', // Altura fixa
                            }}
                        />
                    </div>
                </div>

                <button
                    style={{
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
    );
}

export default TeamB;
