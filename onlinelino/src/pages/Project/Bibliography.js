import React, { useEffect, useState } from 'react';
import { SERVER_URL } from '../../Utils';
import NavbarHome from '../../components/NavbarHome';
import Container from 'react-bootstrap/Container';

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

    if (loading) return <h1>Carregando...</h1>;
    if (error) return <h1>{error}</h1>;

    return (
        <>
            <NavbarHome />
            <br />
            <Container>
                <h4>Bibliografia</h4>
                <br />
                {htmlContent ? (
                    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                ) : (
                    <p>Nenhum item disponível.</p>
                )}
            </Container>
        </>
    );
};

export default Bibliography;
