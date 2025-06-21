import React, { useEffect, useState } from 'react';
import NavbarHome from '../../components/NavbarHome';
import Container from 'react-bootstrap/Container';
import { SERVER_URL } from '../../Utils';

function Overview() {
    const [overviews, setOverviews] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/overview`);
                if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.error);
                }
                const data = await response.json();
                setOverviews(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOverview();
    }, []);

    if (loading) return <h1>Carregando...</h1>;
    if (error) return <h1>{error}</h1>;

    return (
        <>
            <NavbarHome />
            <br />
            <Container>
                {overviews.map((item, index) => (
                    <div key={`overview-${index}`}>
                        {item.descricao_pt?.split('\n').map((para, i) => (
                            <p key={`para-${i}`}>{para}</p>
                        ))}
                        <br />
                        {item.filmes?.length > 0 && (
                            <>
                                <h6>Filmes</h6>
                                <ul>
                                    {item.filmes.map((filme, i) => (
                                        <li key={`filme-${i}`}>
                                            <a href={filme} target="_blank" rel="noreferrer">{filme}</a>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                        {item.outros_links?.length > 0 && (
                            <>
                                <h6>Outros links</h6>
                                <ul>
                                    {item.outros_links.map((link, i) => (
                                        <li key={`link-${i}`}>
                                            <a href={link} target="_blank" rel="noreferrer">{link}</a>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                        <hr />
                    </div>
                ))}
            </Container>
        </>
    );
}

export default Overview;
