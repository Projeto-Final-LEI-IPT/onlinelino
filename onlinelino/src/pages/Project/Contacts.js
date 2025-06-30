import React, { useEffect, useState } from "react";
import NavbarHome from "../../components/NavbarHome";
import Container from "react-bootstrap/esm/Container";
import { SERVER_URL } from "../../Utils";
import ModalMessage from "../../components/ModalMessage";
import '../../style/Loading.css';
import { useTranslation } from "react-i18next";

function Contacts() {
  const { t } = useTranslation(); 

  const [contacts, setContacts] = useState([]);
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
    const fetchContacts = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/contactos`);
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || t('contacts.loadErrorTitle'));
        }
        const data = await response.json();
        setContacts(Array.isArray(data) ? data : []);
      } catch (err) {
        showModal(t('contacts.loadErrorTitle'), t('contacts.loadErrorMessage'), "error");
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [t]);

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
          <h4>{t('contacts.title')}</h4>
          <br />
          {contacts.length > 0 ? (
            contacts.map((item, index) => (
              <ul key={`contact-${index}`}>
                <li>
                  {item.nome} - {item.email}
                </li>
              </ul>
            ))
          ) : (
            <p>{t('contacts.noContacts')}</p>
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
}

export default Contacts;
