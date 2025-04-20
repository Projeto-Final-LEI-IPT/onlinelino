import React, { useEffect, useState } from 'react';
import { SERVER_URL } from '../../Utils';
import NavbarHome from '../../components/NavbarHome';
import Container from 'react-bootstrap/Container'
import { BibliopraphyDO } from '../../server/Models/DataObjects';

const BibliographyIndex = () => {
    const [bibliografia, setBibliografia] = useState(BibliopraphyDO);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLinks = async () => {

            try {
                const response = await fetch(`${SERVER_URL}/bibliografia`)
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(`${error.error}`);
                }

                const data = await response.json();
                setBibliografia(data || BibliopraphyDO);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLinks();
    }, []);

    if (loading) {
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
                {bibliografia && bibliografia.length > 0 ? 
                (<ul>
                    {bibliografia.map((item, index) => (
                        <React.Fragment key={`biblio-${item.id}`}>
                            <li>{item.descricao}</li>
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