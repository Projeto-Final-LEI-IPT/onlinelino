import React, { useState, useEffect } from "react";
import NavbarHome from "../components/NavbarHome";
import Footer from "../components/Footer";
import Container from "react-bootstrap/esm/Container";
import { SERVER_URL } from "../Utils";
import { HomePageDO } from "../server/Models/DataObjects";

function Home() {

    const [descricao, setDescricao] = useState(HomePageDO);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    //GET da Descricao da Home Page
    useEffect(() => {
        const fetchDescricao = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/descricao`);
                if (!response.ok) {
                    throw new Error('Erro ao buscar a descrição');
                }
                const data = await response.json();
                setDescricao(data[0] || HomePageDO);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDescricao();
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
            <div
                style={{
                    backgroundImage: "url('/img/fundo_descricao.webp')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    minHeight: "100vh",
                    paddingTop: "2rem",
                    paddingBottom: "2rem",
                }}
            >
                <Container
                    style={{
                        backgroundColor: "rgba(234, 216, 193, 0.85)",
                        padding: "2rem",
                        marginLeft: "auto",
                        marginRight: "0",
                    }}>
                    {descricao && descricao.descricao_pt
                        ? descricao.descricao_pt.split('\n').map((par, idx) => (
                            <p key={idx}>{par}</p>
                        ))
                        : <p>Nenhuma descrição disponível.</p>
                    }
                </Container>
            </div>
            <Footer />
        </>
    );
}

export default Home;
