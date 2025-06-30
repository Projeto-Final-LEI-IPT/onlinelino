import React, { useEffect, useState } from 'react';
import NavbarHome from '../../components/NavbarHome';
import Container from 'react-bootstrap/Container';
import { SERVER_URL, cleanObjectStrings } from '../../Utils';
import ModalMessage from '../../components/ModalMessage.js';
import '../../style/Loading.css';
import { useTranslation } from 'react-i18next';

const Materials = () => {
    const { t, i18n } = useTranslation();

    const [overview, setOverview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState({
        open: false,
        title: '',
        message: '',
        type: 'info',
        action: null,
    });

    const showModal = (title, message, type = 'info', actionCallback = null) => {
        setModal({
            open: true,
            title,
            message,
            type,
            action: actionCallback
                ? { label: 'OK', onClick: actionCallback }
                : null,
        });
    };

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/materiais`);
                if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.error);
                }
                const data = await response.json();
                const cleaned = cleanObjectStrings(data[0]);
                setOverview(cleaned);
            } catch (err) {
                showModal(t('materials.errorTitle'), t('materials.errorMessage'), 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchOverview();
    }, [t]);

    const getDescriptionByLanguage = () => {
        if (!overview) return null;
        const lang = i18n.language;
        if (lang.startsWith('pt')) {
            return overview.descricao_pt;
        }
        if (lang.startsWith('en')) {
            return overview.descricao_en;
        }
        return overview.descricao_pt;
    };

    return (
        <>
            <ModalMessage
                isOpen={modal.open}
                onClose={() => setModal((m) => ({ ...m, open: false }))}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                action={modal.action}
            />

            {loading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            )}

            <NavbarHome />
            <div style={{ overflow: "hidden" }}>
                <div
                    style={{
                        backgroundImage: "url('/img/RL_FOTO1.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "right center",
                        backgroundRepeat: "no-repeat",
                        backgroundAttachment: "scroll",
                        minHeight: "100vh",
                        display: "flex",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        paddingTop: "2rem",
                        paddingBottom: "2rem",
                    }}
                >
                    <Container
                        style={{
                            backgroundColor: "rgba(234, 216, 193, 0.85)",
                            padding: "2rem",
                            marginLeft: "auto",
                            marginRight: "3%",
                            maxWidth: "600px",
                            width: "100%",
                        }}
                    >
                        <h4>{t('materials.title')}</h4>
                        <br />
                        {getDescriptionByLanguage() ? (
                            <div
                                style={{ whiteSpace: 'pre-line' }}
                                dangerouslySetInnerHTML={{ __html: getDescriptionByLanguage() }}
                            />
                        ) : (
                            <p>{t('materials.noInformation')}</p>
                        )}
                    </Container>
                </div>
            </div>
        </>
    );
};

export default Materials;
