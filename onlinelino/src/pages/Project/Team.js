import React, { useEffect, useState } from 'react';
import NavbarHome from '../../components/NavbarHome';
import Container from 'react-bootstrap/esm/Container';
import { SERVER_URL } from '../../Utils';
import { TeamDO } from '../../server/Models/DataObjects';

function Team() {
    const [team, setTeam] = useState([TeamDO]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/equipa`);
                if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.error || 'Erro na requisição');
                }

                const data = await response.json();
                setTeam(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTeam();
    }, []);

    if (loading) {
        return <h1>Carregando...</h1>;
    }

    if (error) {
        return <h1>Erro: {error}</h1>;
    }

    const investigadores = team.filter(p => p.cargo.toLowerCase() === 'investigador');
    const colaboradores = team.filter(p => p.cargo.toLowerCase() === 'colaborador' || p.cargo.toLowerCase() === 'estudante');

    return (
        <>
            <NavbarHome />
            <br />
            <Container className="container">
                <h4>Equipa</h4>
                <br />
                <h5>Investigadores:</h5>
                {investigadores.map((membro, i) => (
                    <ul key={`inv-${i}`}><li>{membro.nome}</li></ul>
                ))}
                <hr />
                <h5>Colaboradores:</h5>
                {colaboradores.map((membro, i) => (
                    <ul key={`col-${i}`}><li>{membro.nome}, {membro.cargo}</li></ul>
                ))}
            </Container>
        </>
    );
}

export default Team;
