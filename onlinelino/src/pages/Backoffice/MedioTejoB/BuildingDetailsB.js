import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavbarBackoffice from "../../../components/NavbarBackoffice";
import Container from 'react-bootstrap/Container';
import { SERVER_URL } from '../../../Utils';

const BuildingDetailsB = () => {
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

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <>
      <NavbarBackoffice />
      <Container style={{ paddingTop: '2rem' }}>
        <h2>{obra?.titulo}</h2>
        <p><strong>Data do Projeto:</strong> {obra?.data_projeto}</p>
        <p><strong>Tipologia:</strong> {obra?.tipologia}</p>
        <p><strong>Localização:</strong> {obra?.localizacao}</p>
        <p>{obra?.descricao_pt}</p>

        {obra?.outros_links && obra.outros_links.length > 0 && (
          <>
            <h5>Outros Links</h5>
            <ul>
              {obra.outros_links.map((link, i) => (
                <li key={i}>
                  <a href={link} target="_blank" rel="noreferrer">{link}</a>
                </li>
              ))}
            </ul>
          </>
        )}

        {obra?.imagens && obra.imagens.length > 0 && (
          <>
            <h5>Imagens</h5>
            {obra.imagens.map((img, index) => (
              <div key={index} style={{ marginBottom: '20px', textAlign: 'center' }}>
                <img src={img.caminho} alt={img.descricao_pt || 'Imagem da obra'} style={{ maxWidth: '500px', maxHeight: '500px' }} />
                <p>{img.descricao_pt}</p>
              </div>
            ))}
          </>
        )}
      </Container>
    </>
  );
};

export default BuildingDetailsB;
