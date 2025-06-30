import React, { useEffect, useState } from 'react';
import NavbarHome from '../../components/NavbarHome';
import Container from 'react-bootstrap/esm/Container';
import { SERVER_URL } from '../../Utils';
import { TeamDO } from '../../server/Models/DataObjects';
import '../../style/Loading.css';
import ModalMessage from '../../components/ModalMessage.js';
import { useTranslation } from 'react-i18next';

function Team() {
  const [team, setTeam] = useState([TeamDO]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    action: null,
  });
  const { t } = useTranslation('translation');

  const showModal = (title, message, type = 'info', action = null) => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      action,
    });
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

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
        showModal(t('loadErrorTitle'), err.message, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [t]);

  const investigadores = team.filter(
    (p) => p.cargo.toLowerCase() === 'investigador'
  );
  const colaboradores = team.filter(
    (p) => p.cargo.toLowerCase() === 'colaborador'
  );

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
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          paddingTop: '2rem',
          paddingBottom: '2rem',
        }}
      >
        <Container
          className="container"
          style={{
            backgroundColor: 'rgba(234, 216, 193, 0.85)',
            padding: '2rem',
            marginLeft: 'auto',
            marginRight: '0',
          }}
        >
          <h4>{t('team.title')}</h4>
          <br />
          <h5>{t('team.investigators')}:</h5>
          {investigadores.map((membro, i) => (
            <ul key={`inv-${i}`}>
              <li>{membro.nome}</li>
            </ul>
          ))}
          <hr />
          <h5>{t('team.collaborators')}:</h5>
          {colaboradores.map((membro, i) => (
            <ul key={`col-${i}`}>
              <li>
                {membro.nome}, {membro.cargo}
              </li>
            </ul>
          ))}
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
}

export default Team;
