import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import Container from "react-bootstrap/esm/Container";
import { HomePageDO } from "../../server/Models/DataObjects";
import NavbarHome from "../../components/NavbarHome";
import { SERVER_URL, cleanObjectStrings } from "../../Utils";
import Footer from "../../components/Footer";
import ModalMessage from "../../components/ModalMessage";
import '../../style/Loading.css';

function Home() {
  const { i18n } = useTranslation();
  const [descricao, setDescricao] = useState(HomePageDO);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    action: null,
  });

  const showModal = (title, message, type = "info", action = null) => {
    setModal({ isOpen: true, title, message, type, action });
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  useEffect(() => {
    const fetchDescricao = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/descricao`);
        if (!response.ok) {
          throw new Error("Erro ao buscar a descrição");
        }
        const data = await response.json();
        setDescricao(cleanObjectStrings(data[0]) || HomePageDO);
      } catch (err) {
        showModal("Erro interno.", "Por favor, tente novamente mais tarde.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchDescricao();
  }, []);

  const currentLang = i18n.language || 'pt';
  const descricaoText = currentLang.startsWith('en')
    ? descricao.descricao_en
    : descricao.descricao_pt;

  return (
    <>
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

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
          }}
        >
          {descricaoText ? (
            descricaoText.split("\n").map((par, idx) => <p key={idx} dangerouslySetInnerHTML={{ __html: par }} />)
          ) : (
            <p>Nenhuma descrição disponível.</p>
          )}
        </Container>
      </div>

      <Footer />

      <ModalMessage
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        action={modal.action}
      />
    </>
  );
}

export default Home;
