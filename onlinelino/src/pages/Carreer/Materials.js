import React, { useEffect, useState } from 'react';
import NavbarHome from '../../components/NavbarHome';
import Container from 'react-bootstrap/Container';
import { SERVER_URL, cleanObjectStrings } from '../../Utils';
import ModalMessage from '../../components/ModalMessage.js';
import '../../style/Loading.css';

const Materials = () => {
    const [overview, setOverview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState({
        open: false,
        title: '',
        message: '',
        type: 'info',
        action: null,
    });

    const showModal = (title, message, type = 'info', actionCallback = null) => {
        setModal({
            open: true,
            title,
            message,
            type,
            action: actionCallback
                ? { label: 'OK', onClick: actionCallback }
                : null,
        });
    };

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/materiais`);
                if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.error);
                }
                const data = await response.json();
                const cleaned = cleanObjectStrings(data[0]);
                setOverview(cleaned);
            } catch (err) {
                showModal('Erro interno.', "Por favor, tente novamente mais tarde.", 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchOverview();
    }, []);

    return (
        <>
            <ModalMessage
                isOpen={modal.open}
                onClose={() => setModal((m) => ({ ...m, open: false }))}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                action={modal.action}
            />

            {loading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            )}

            <NavbarHome />
            <div style={{ overflow: "hidden" }}>
                <div
                    style={{
                        backgroundImage: "url('/img/RL_FOTO1.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "right center",
                        backgroundRepeat: "no-repeat",
                        backgroundAttachment: "scroll",
                        minHeight: "100vh",
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
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
                        <h4>Materiais</h4>
                        <br />
                        {overview?.descricao_pt && (
                            <p style={{ whiteSpace: "pre-line" }}>{overview.descricao_pt}</p>
                        )}
                        <br />
                        {overview?.filmes?.length > 0 && (
                            <>
                                <h6>Filmes</h6>
                                <ul>
                                    {overview.filmes.map((url, i) => (
                                        <li key={`filme-${i}`}>
                                            <a
                                                style={{
                                                    wordBreak: "break-word",
                                                    overflowWrap: "break-word",
                                                    display: "inline-block",
                                                    maxWidth: "100%",
                                                }}
                                                href={url}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {url}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                        {overview?.outros_links?.length > 0 && (
                            <>
                                <h6>Outros links</h6>
                                <ul>
                                    {overview.outros_links.map((link, i) => (
                                        <li key={`link-${i}`}>
                                            <a
                                                style={{
                                                    wordBreak: "break-word",
                                                    overflowWrap: "break-word",
                                                    display: "inline-block",
                                                    maxWidth: "100%",
                                                }}
                                                href={link}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </Container>
                </div>
            </div>
        </>
    );
};

export default Materials;
