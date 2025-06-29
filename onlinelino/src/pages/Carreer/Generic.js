import React, { useEffect, useState } from "react";
import NavbarHome from "../../components/NavbarHome";
import Container from "react-bootstrap/esm/Container";
import { SERVER_URL, cleanObjectStrings } from '../../Utils';
import '../../style/Loading.css';

//FAZER REQUEST DO OVERVIEW
function Generic() {
    const [overview, setOverview] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    //INSERIR TEXTO DO TEAMS
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

    if (error) return <h1>{error}</h1>;

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
                        }}
                    >
                        <h4>Sobre Raul Lino</h4>
                        <br />
                        <br />
                        <div
                            style={{
                                lineHeight: 1.6,
                                color: '#222',
                                wordBreak: 'break-word',
                                overflowWrap: 'anywhere',
                            }}
                            dangerouslySetInnerHTML={{ __html: overview.descricao_pt }}
                        />

                    </Container>
                </div>
            </div>
        </>
    );
};

export default Generic;