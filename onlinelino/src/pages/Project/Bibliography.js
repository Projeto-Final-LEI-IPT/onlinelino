import React, { useEffect, useState } from 'react';
import { SERVER_URL } from '../../Utils';
import NavbarHome from '../../components/NavbarHome';
import Container from 'react-bootstrap/Container';
import ModalMessage from '../../components/ModalMessage';
import '../../style/Loading.css';

const Bibliography = () => {
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    action: null,
  });

  const showModal = (title, message, type = 'info', action = null) => {
    setModal({ isOpen: true, title, message, type, action });
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  useEffect(() => {
    const fetchBibliografia = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/bibliografia`);
        if (!response.ok) {
          const error = await response.json();
          throw new Error('Erro ao buscar bibliografia');
        }

        const data = await response.json();

        if (data.length > 0 && data[0].texto_html) {
          setHtmlContent(data[0].texto_html);
        } else {
          setHtmlContent('');
        }
      } catch (err) {
        showModal('Erro interno.', 'Por favor, tente novamente mais tarde.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchBibliografia();
  }, []);

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
        <br />
        <Container
          style={{
            backgroundColor: "rgba(234, 216, 193, 0.85)",
            padding: "2rem",
            marginLeft: "auto",
            marginRight: "0",
          }}
        >
          <h4>Bibliografia</h4>
          <br />
          {htmlContent ? (
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          ) : (
            <p>Nenhum item disponível.</p>
          )}
        </Container>
      </div>

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
};

export default Bibliography;
