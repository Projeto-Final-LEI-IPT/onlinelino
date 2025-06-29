import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavbarHome from '../../components/NavbarHome';
import Container from 'react-bootstrap/Container';
import { SERVER_URL, cleanObjectStrings } from '../../Utils';
import '../../style/Loading.css'

const BuildingDetails = () => {
    const { id } = useParams();
    const [edificio, setEdificio] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchObra = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/edificio/${id}`);
                if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.error);
                }

                const data = await response.json();

                const {
                    descricao_pt,
                    descricao_en,
                    fontes_bibliografia,
                    ...rest
                } = data;

                const cleanedRest = cleanObjectStrings(rest);

                setEdificio({
                    ...cleanedRest,
                    descricao_pt: descricao_pt || '',
                    descricao_en: descricao_en || '',
                    fontes_bibliografia: fontes_bibliografia || '',
                });

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchObra();
    }, [id]);

    if (error) return <h1>{error}</h1>;

    return (
        <>
        {loading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            )}
            <NavbarHome />
            <br />
            <Container>
                <h4>{edificio?.titulo}</h4>
                <p><strong>Data do Projeto:</strong> {edificio?.data_projeto}</p>
                <p><strong>Tipologia:</strong> {edificio?.tipologia}</p>
                <p><strong>Localização:</strong> {edificio?.localizacao}</p>
                <div dangerouslySetInnerHTML={{ __html: edificio?.descricao_pt }} />
                <h6><strong>Fontes e Bibliografia:</strong></h6>
                <div dangerouslySetInnerHTML={{ __html: edificio?.fontes_bibliografia }} />

                <h6><strong>Imagens:</strong></h6>
                {edificio?.imagens?.map((img, index) => (
                    <div key={`img-${index}`} style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <img src={img.caminho} alt="" style={{ maxWidth: '500px', maxHeight: '500px' }} />
                        <p>{img.legenda_pt}</p>
                    </div>
                ))}
            </Container>
        </>
    );
};

export default BuildingDetails;
