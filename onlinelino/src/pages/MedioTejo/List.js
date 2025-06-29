import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SERVER_URL, cleanObjectStrings } from '../../Utils';
import NavbarHome from '../../components/NavbarHome';
import ModalMessage from '../../components/ModalMessage';
import '../../style/List.css';
import '../../style/Loading.css';

function ListIndex() {
  const [edificios, setEdificios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchEdificios = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/listaEdificios`);
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error);
        }
        let data = await res.json();

        // Limpar tags HTML de todos os campos string de cada objeto
        data = data.map(item => cleanObjectStrings(item));

        // Ordenar por data 
        data.sort((a, b) =>
          a.data_projeto.localeCompare(b.data_projeto, undefined, { numeric: true })
        );

        setEdificios(data);
      } catch (err) {
        setError('Erro interno');
        setModalOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEdificios();
  }, []);

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
      <div style={{
        backgroundImage: "url('/img/fundo_descricao.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        paddingTop: "2rem",
        paddingBottom: "2rem",
      }}>
        <div className="container"
          style={{
            backgroundColor: "rgba(234, 216, 193, 0.85)",
            padding: "2rem",
            marginLeft: "auto",
            marginRight: "0",
          }}>
          <ul className="two-column-list">
            {edificios.map((edificio) => (
              <Link
                to={`/MedioTejo/${edificio.id}`}
                key={edificio.id}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <li className="list-item">
                  <div className="text-year-list">
                    <span className="year-highlight">{edificio.data_projeto}</span>
                  </div>
                  <div className="text-title-list">{edificio.titulo}</div>
                </li>
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default ListIndex;
