import React, { useEffect, useState } from 'react';
import NavbarHome from '../../components/NavbarHome';
import Container from 'react-bootstrap/Container';
import { SERVER_URL, removeHtmlTags } from '../../Utils';
import { FaSearch } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import '../../style/Loading.css';
import ModalMessage from '../../components/ModalMessage'; 

const Index = () => {
  const [works, setWorks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false); 
  const { t } = useTranslation();

  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/listaEdificios`);
        if (!res.ok) {
          const err = await res.json();
          throw new Error('Erro ao buscar lista de edifícios');
        }

        const data = await res.json();

        const cleanedData = data.map((item) => ({
          ...item,
          data_projeto: removeHtmlTags(item.data_projeto || ''),
          titulo: removeHtmlTags(item.titulo || '')
        }));

        cleanedData.sort((a, b) =>
          a.data_projeto.localeCompare(b.data_projeto, undefined, { numeric: true })
        );

        setWorks(cleanedData);
      } catch (err) {
        setError(err.message);
        setModalOpen(true); 
      } finally {
        setLoading(false);
      }
    };

    fetchWorks();
  }, []);

  const filteredWorks = works.filter((obra) =>
    searchTerm.length >= 3 &&
    (
      obra.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      obra.data_projeto.includes(searchTerm)
    )
  );

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
        title="Erro interno."
        message={'Por favor, tente novamente mais tarde.'}
        type="error"
        action={{
          label: 'Fechar',
          onClick: () => setModalOpen(false),
        }}
      />

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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            minHeight: "60vh",
          }}
        >
          <div style={{ position: "relative", marginBottom: "1.5rem", width: "70%" }}>
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem 2.5rem 0.5rem 0.75rem",
                fontSize: "1rem",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            <FaSearch
              style={{
                position: "absolute",
                right: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#aaa",
                pointerEvents: "none",
              }}
            />
          </div>

          {searchTerm.length >= 3 && (
            <ul style={{ width: "70%", listStyle: "none", padding: 0 }}>
              {filteredWorks.map((obra) => (
                <li key={obra.id} style={{ marginBottom: "0.5rem" }}>
                  <Link
                    to={`/MedioTejo/${obra.id}`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "rgba(255,255,255,0.85)",
                        padding: "1rem",
                        borderRadius: "5px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <strong style={{ color: "#777", minWidth: "50px", textAlign: "left" }}>
                        {obra.data_projeto}
                      </strong>
                      <span>{obra.titulo}</span>
                    </div>
                  </Link>
                </li>
              ))}
              {filteredWorks.length === 0 && (
                <li
                  style={{
                    backgroundColor: "rgba(255,255,255,0.85)",
                    padding: "1rem",
                    marginBottom: "0.5rem",
                    borderRadius: "5px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  {t("No Results")}
                </li>
              )}
            </ul>
          )}
        </Container>
      </div>
    </>
  );
};

export default Index;
