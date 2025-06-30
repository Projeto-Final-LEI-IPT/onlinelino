import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import NavbarHome from '../../components/NavbarHome';
import Container from 'react-bootstrap/Container';
import { SERVER_URL, cleanObjectStrings } from '../../Utils';
import '../../style/Loading.css';
import { useTranslation } from 'react-i18next';

const BuildingDetails = () => {
    const { t, i18n } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate(); 
    const [edificio, setEdificio] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchObra = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/edificio/${id}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        navigate('/not-found', { replace: true }); 
                        return;
                    }
                    const err = await response.json();
                    throw new Error(err.error || 'Erro ao buscar dados');
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
    }, [id, navigate]);

    if (error) return <h1>{error}</h1>;

    const getDescriptionByLanguage = () => {
        if (!edificio) return null;
        const lang = i18n.language;
        if (lang.startsWith('pt')) return edificio.descricao_pt;
        if (lang.startsWith('en')) return edificio.descricao_en;
        return edificio.descricao_pt;
    };

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
                <p><strong>{t('building.projectDate')}:</strong> {edificio?.data_projeto}</p>
                <p><strong>{t('building.typology')}:</strong> {edificio?.tipologia}</p>
                <p><strong>{t('building.location')}:</strong> {edificio?.localizacao}</p>
                <div dangerouslySetInnerHTML={{ __html: getDescriptionByLanguage() }} />
                <h6><strong>{t('building.bibliography')}:</strong></h6>
                <div dangerouslySetInnerHTML={{ __html: edificio?.fontes_bibliografia }} />

                <h6><strong>{t('building.images')}:</strong></h6>
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
