import React, { useState, useEffect } from "react";
import NavbarHome from "../components/NavbarHome";
import Footer from "../components/Footer";
import Container from "react-bootstrap/esm/Container";
import { SERVER_URL, BACKOFFICE_URL } from "../Utils";

function Home() {

    const [descricao, setDescricao] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    //GET da Descricao da Home Page
    useEffect(() => {
        const fetchDescricao = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/home`);
                if (!response.ok) {
                    throw new Error('Erro ao buscar a descrição');
                }
                const data = await response.json();
                setDescricao(data);
            } catch (err) {
                setError(err.message);
            }finally {
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
            <br />
            <Container>
            {descricao && descricao.length > 0 ? (
                    descricao.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))
                ) : (
                    <p>Nenhuma descrição disponível.</p>
                )}
            </Container>
            <Footer />
        </>
    );
}

export default Home;