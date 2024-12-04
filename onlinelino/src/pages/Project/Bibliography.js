import React, { useEffect, useState } from 'react';
import { SERVER_URL, BACKOFFICE_URL } from '../../Utils';
import NavbarHome from '../../components/NavbarHome';
import { Container } from 'react-bootstrap/esm/Container';

const BibliographyIndex = () => {
    const [bibliografia, setBibliografia] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const SESSION_TOKEN = sessionStorage.getItem('authorization'); 

    useEffect(() => {
        const fetchLinks = async () => {
            if (!SESSION_TOKEN) {
                alert('UTILIZADOR NÃO AUTENTICADO');
                return;
            }

            try {
                const response = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/bibliografia`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${SESSION_TOKEN}`,
                    },
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(`${error.error}`);
                }

                const data = await response.json();
                setBibliografia(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLinks();
    }, [SESSION_TOKEN]); 

    if (loading && !SESSION_TOKEN) {
        return <h1>NÃO AUTORIZADO</h1>;
    }else{
        <h1>Carregando...</h1>;
    }

    if (error) {
        return <h1>{error}</h1>;
    }

    return (
        <>
            <NavbarHome />
            <br />
            <Container>
                <h4>Bibliografia</h4>
                <br />
                {bibliografia && bibliografia.length > 0 ? (<ul>
                    {bibliografia.map((paragraph, index) => (
                        <React.Fragment key={`li-${index}`}>
                            <li key={`biblio-${index}`}>{paragraph}</li>
                            <br />
                        </React.Fragment>
                    ))}
                </ul>) : (
                    <p>Nenhum link disponível.</p>
                )}

            </Container>
        </>
    );
}

export default BibliographyIndex;