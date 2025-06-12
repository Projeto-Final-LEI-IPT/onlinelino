import React, { useEffect, useState } from 'react';
import NavbarHome from '../../components/NavbarHome';
import Container from 'react-bootstrap/Container';
import { SERVER_URL } from '../../Utils';

const Materials = () => {
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
                setOverview(data[0]);
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
            <div style={{ overflow: "hidden" }}>
                <div
                    style={{
                        backgroundImage: "url('/img/RL_FOTO1.jpg')",
                        backgroundSize: "cover",                  // cobre toda a área
                        backgroundPosition: "right center",      // sempre centralizado
                        backgroundRepeat: "no-repeat",            // não repete
                        backgroundAttachment: "scroll",           // comportamento padrão
                        minHeight: "100vh",                       // altura mínima de 100% da janela
                        display: "flex",                          // centra verticalmente (opcional)
                        justifyContent: "flex-end",               // alinha container à direita
                        alignItems: "center",                     // alinha verticalmente
                        paddingTop: "2rem",
                        paddingBottom: "2rem",
                    }}
                >
                    <Container
                        style={{
                            backgroundColor: "rgba(234, 216, 193, 0.85)",
                            padding: "2rem",
                            marginLeft: "auto",
                            marginRight: "3%",
                            maxWidth: "600px",
                            width: "100%",
                        }}
                    >
                        <h4>Sobre Raul Lino</h4>
                        <br />
                        {overview?.descricao_pt && (
                            <p>{overview.descricao_pt}</p>
                        )}
                        <br />
                        <h6>Filmes</h6>
                        <ul>
                            {overview?.filmes?.map((url, i) => (
                                <li key={`filme-${i}`}>
                                    <a
                                        style={{
                                            wordBreak: "break-word",
                                            overflowWrap: "break-word",
                                            display: "inline-block",
                                            maxWidth: "100%",
                                        }}
                                        href={url} target="_blank" rel="noreferrer">{url}</a>
                                </li>
                            ))}
                        </ul>
                        <h6>Outros links</h6>
                        <ul>
                            {overview?.outros_links?.map((link, i) => (
                                <li key={`link-${i}`}>
                                    <a
                                        style={{
                                            wordBreak: "break-word",
                                            overflowWrap: "break-word",
                                            display: "inline-block",
                                            maxWidth: "100%",
                                        }}
                                        href={link} target="_blank" rel="noreferrer">{link}</a>
                                </li>
                            ))}
                        </ul>
                    </Container>
                </div>
            </div>
        </>
    );
};


export default Materials;
