import React, { useEffect, useState } from 'react';
import { SERVER_URL } from '../../Utils';
import NavbarHome from '../../components/NavbarHome';
import Container from 'react-bootstrap/Container';
import '../../style/Loading.css'

const Bibliography = () => {
    const [htmlContent, setHtmlContent] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBibliografia = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/bibliografia`);
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(`${error.message}`);
                }

                const data = await response.json();

                // Pega o primeiro item e renderiza o HTML completo
                if (data.length > 0 && data[0].texto_html) {
                    setHtmlContent(data[0].texto_html);
                } else {
                    setHtmlContent('');
                }

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBibliografia();
    }, []);

    if (error) return <h1>{error}</h1>;

    return (
        <>
        {loading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            )}
            <NavbarHome />
            <div
                style={{
                    backgroundImage: "url('/img/fundo_descricao.webp')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    minHeight: "100vh",
                    paddingTop: "2rem",
                    paddingBottom: "2rem",
                }}
            >
            <br />
            <Container
            style={{
                        backgroundColor: "rgba(234, 216, 193, 0.85)",
                        padding: "2rem",
                        marginLeft: "auto",
                        marginRight: "0",
                    }}
                >
                <h4>Bibliografia</h4>
                <br />
                {htmlContent ? (
                    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                ) : (
                    <p>Nenhum item disponível.</p>
                )}
            </Container>
            </div>
        </>
    );
};

export default Bibliography;
