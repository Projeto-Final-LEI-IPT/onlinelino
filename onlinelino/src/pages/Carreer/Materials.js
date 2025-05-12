import React, { useEffect, useState } from 'react';
import NavbarHome from '../../components/NavbarHome';
import Container from 'react-bootstrap/Container';
import { SERVER_URL } from '../../Utils';

const About = () => {
    const [overview, setOverview] = useState(null);
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
                setOverview(data);
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
                <h4>{overview?.titulo}</h4>
                <br />
                {overview?.paragrafos?.map((text, i) => (
                    <p key={`p-${i}`}>{text}</p>
                ))}
                <br />
                <h6>Filmes</h6>
                <ul>
                    {overview?.filmes?.map((filme, i) => (
                        <React.Fragment key={`filme-${i}`}>
                            <li>
                                <a href={filme.url} target="_blank" rel="noreferrer">{filme.url}</a><br />
                                {filme.titulo && <span>[{filme.titulo}]</span>}
                            </li>
                            <br />
                        </React.Fragment>
                    ))}
                </ul>
                <h6>Outros links</h6>
                <ul>
                    {overview?.outros_links?.map((link, i) => (
                        <React.Fragment key={`link-${i}`}>
                            <li>
                                <a href={link} target="_blank" rel="noreferrer">{link}</a>
                            </li>
                            <br />
                        </React.Fragment>
                    ))}
                </ul>
            </Container>
        </>
    );
};


export default Materials;
