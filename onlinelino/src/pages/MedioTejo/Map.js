import React, { useEffect, useState } from 'react';
import NavbarHome from '../../components/NavbarHome';
import Container from 'react-bootstrap/Container';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { SERVER_URL, cleanObjectStrings } from '../../Utils';
import { Link } from 'react-router-dom';
import ModalMessage from '../../components/ModalMessage';
import 'leaflet/dist/leaflet.css';
import '../../style/Loading.css';

// Corrige bug de ícones do Leaflet no React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const Map = () => {
  const [edificios, setEdificios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/mapaEdificios`);
        if (!response.ok) throw new Error('Erro ao buscar dados do mapa');
        const data = await response.json();

        const cleanedData = data.map(edificio => {
          const cleaned = cleanObjectStrings({
            titulo: edificio.titulo,
            data_projeto: edificio.data_projeto
          });
          return {
            ...edificio,
            titulo: cleaned.titulo,
            data_projeto: cleaned.data_projeto
          };
        });

        setEdificios(cleanedData);
      } catch (err) {
        setError('Erro interno');
        setModalOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const validLocations = edificios.filter(e => e.latitude && e.longitude);
  const center = validLocations.length > 0
    ? [validLocations[0].latitude, validLocations[0].longitude]
    : [39.600562, -8.3924043]; // IPT fallback

  return (
    <>
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      <ModalMessage
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Erro interno"
        message="Por favor, tente novamente mais tarde."
        type="error"
        action={{
          label: 'Fechar',
          onClick: () => setModalOpen(false),
        }}
      />

      <NavbarHome />
      <br />
      <Container>
        <MapContainer
          center={center}
          zoom={7}
          style={{ width: '100%', height: '60vh' }}
        >
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {validLocations.map(edificio => (
            <Marker
              key={edificio.id}
              position={[edificio.latitude, edificio.longitude]}
            >
              <Popup>
                <Link to={`/MedioTejo/${edificio.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ textAlign: 'center' }}>
                    <img
                      src={edificio.caminho_imagem}
                      alt="preview"
                      style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: '5px' }}
                    />
                    <br />
                    <strong>{edificio.titulo}</strong>
                    <br />
                    <span>{edificio.data_projeto}</span>
                  </div>
                </Link>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Container>
    </>
  );
};

export default Map;
