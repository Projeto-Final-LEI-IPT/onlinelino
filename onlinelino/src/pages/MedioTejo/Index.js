import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavbarHome from '../../components/NavbarHome';
import Container from 'react-bootstrap/Container';
import { SERVER_URL } from '../../Utils';

const Index = () => {
    const { id } = useParams();
    const [obra, setObra] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchObra = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/obra/${id}`);
                if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.error);
                }
                const data = await response.json();
                setObra(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchObra();
    }, [id]);

    if (loading) return <h1>Carregando...</h1>;
    if (error) return <h1>{error}</h1>;

    return (
        <>
            <NavbarHome />
            <br />
            <Container>
                <h4>{obra?.titulo}</h4>
                <p><strong>Data do Projeto:</strong> {obra?.data_projeto}</p>
                <p><strong>Tipologia:</strong> {obra?.tipologia}</p>
                <p><strong>Localização:</strong> {obra?.localizacao}</p>
                <p>{obra?.descricao_pt}</p>

                <h6>Filmes</h6>
                <ul>
                    {obra?.filmes?.map((url, i) => (
                        <li key={`filme-${i}`}>
                            <a href={url} target="_blank" rel="noreferrer">{url}</a>
                        </li>
                    ))}
                </ul>

                <h6>Outros Links</h6>
                <ul>
                    {obra?.outros_links?.map((link, i) => (
                        <li key={`link-${i}`}>
                            <a href={link} target="_blank" rel="noreferrer">{link}</a>
                        </li>
                    ))}
                </ul>

                <h6>Imagens</h6>
                {obra?.imagens?.map((img, index) => (
                    <div key={`img-${index}`} style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <img src={img.caminho} alt="" style={{ maxWidth: '500px', maxHeight: '500px' }} />
                        <p>{img.descricao_pt}</p>
                    </div>
                ))}
            </Container>
        </>
    );
};

export default Index;
