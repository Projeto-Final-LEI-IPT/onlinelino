import React, { useState, useEffect } from "react";
import NavbarHome from "../../components/NavbarHome";
import Container from "react-bootstrap/esm/Container";
import { SERVER_URL, BACKOFFICE_URL } from "../../Utils";

function BibliographyIndex() {
    const [bibliografia, setBibliografia] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);


    //GET dos links da Bibliografia
    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/bibliografia`);
                if (!response.ok) {
                    throw new Error('Erro ao buscar os links');
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
    }, []);

    if (error) {
        return <p className="text-red-500">Erro: {error}</p>;
    }

    if (loading) {
        return <p>A carregar...</p>;
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