import React from "react";

function AboutB() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <h2>Sobre o Médio Tejo</h2>
            <textarea
                placeholder="Digite aqui..."
                rows="6"
                style={{ width: '80%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
        </div>
    );
}

export default AboutB;
