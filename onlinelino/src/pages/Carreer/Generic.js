import React, { useEffect, useState } from "react";
import NavbarHome from "../../components/NavbarHome";
import Container from "react-bootstrap/esm/Container";
import { SERVER_URL, cleanObjectStrings } from '../../Utils';
import ModalMessage from "../../components/ModalMessage";
import '../../style/Loading.css';

function Generic() {
    const [overview, setOverview] = useState(null);
    const [loading, setLoading] = useState(true);

    const [modal, setModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        type: "info",
        action: null,
    });

    const showModal = (title, message, type = "info", action = null) => {
        setModal({ isOpen: true, title, message, type, action });
    };

    const closeModal = () => {
        setModal({ ...modal, isOpen: false });
    };

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/overview`);
                if (!response.ok) {
                    throw new Error("Erro ao buscar overview");
                }
                const data = await response.json();
                setOverview(data?.[0] || null);

            } catch (err) {
                showModal("Erro interno.", "Por favor, tente novamente mais tarde.", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchOverview();
    }, []);

    const renderDescricao = (htmlString) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");
        const elements = Array.from(doc.body.children);

        return elements.map((el, idx) => {
            if (el.tagName === 'P') {
                return <p key={idx}>{el.textContent}</p>;
            }

            if (el.tagName === 'H4') {
                return <h4 key={idx} style={{ marginTop: '1.5rem' }}>{el.textContent}</h4>;
            }

            if (el.tagName === 'UL') {
                const items = Array.from(el.children).map((li, i) => {
                    const link = li.querySelector('a');
                    const text = link?.textContent || '';
                    const href = link?.getAttribute('href') || '#';
                    const comment = li.textContent.replace(text, '').trim();

                    return (
                        <li key={i}>
                            <a href={href} target="_blank" rel="noopener noreferrer">{text}</a>
                            {comment && ` ${comment}`}
                        </li>
                    );
                });

                return <ul key={idx} style={{ paddingLeft: '1.25rem', marginBottom: '1rem' }}>{items}</ul>;
            }

            return null;
        });
    };

    return (
        <>
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
                            color: "#222",
                            lineHeight: 1.6,
                            overflowWrap: "anywhere",
                        }}
                    >
                        <h4>Sobre Raul Lino</h4>
                        <br />
                        {overview ? (
                            <div>{renderDescricao(overview.descricao_pt)}</div>
                        ) : (
                            <p>Informação não disponível.</p>
                        )}
                    </Container>
                </div>
            </div>

            <ModalMessage
                isOpen={modal.isOpen}
                onClose={closeModal}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                action={modal.action}
            />
        </>
    );
}

export default Generic;
