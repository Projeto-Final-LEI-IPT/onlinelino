import React from "react";
import NavbarHome from "../../components/NavbarHome";
import Container from "react-bootstrap/esm/Container";
import { useTranslation } from 'react-i18next';

function GenericIndex() {
    const { t } = useTranslation();
    const { t: v } = useTranslation('translation', { keyPrefix: 'biographyPage.videos' });
    const videos = [];
    for (let i = 0; i < 50; i++) {
        if (!v([i]).includes("biographyPage.videos")) {
            videos.push(v([i]));
        }
    }
    const { t: s } = useTranslation('translation', { keyPrefix: 'biographyPage.videosSubtitle' });
    const videosSubtitle = [];
    for (let i = 0; i < 50; i++) {
        if (!s([i]).includes("biographyPage.videosSubtitle")) {
            videosSubtitle.push(s([i]));
        }
    }
    const { t: l } = useTranslation('translation', { keyPrefix: 'biographyPage.otherLinks' });
    const links = [];
    for (let i = 0; i < 50; i++) {
        if (!l([i]).includes("biographyPage.otherLinks")) {
            links.push(l([i]));
        }
    }

    return (
        <>
            {/* Navbar fixa no topo */}
            <NavbarHome
                style={{
                    position: "fixed", 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    zIndex: 10, 
                    width: "100%",
                }} 
            />

            <div
                style={{
                    display: "flex",            // Utiliza Flexbox
                    flexDirection: "column",    // Alinha os itens verticalmente
                    height: "auto",            // Garantir que a altura do contêiner ocupe 100% da altura da tela
                }}
            >
                {/* Contêiner principal com imagem de fundo */}
                <div
                    style={{
                        position: "absolute", // A imagem de fundo será posicionada de forma absoluta
                        top: 0,               // Posiciona no topo do contêiner
                        left: 0,
                        bottom: 0,
                        right: 0,
                        width: "100%",        // Largura 100% da tela
                        height: "100%",       // Altura 100% da tela
                        backgroundImage: "url('/img/foto_rl.jpg')",
                        backgroundSize: "cover", // A imagem cobre toda a área disponível
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center", // A imagem será centrada
                        zIndex: -1,          // Coloca a imagem de fundo atrás do conteúdo
                    }}
                />
                
                {/* Contêiner do texto */}
                <Container
                    style={{
                        flex: 1,
                        backgroundColor: "rgba(234, 216, 193, 0.8)",
                        zIndex: 0,
                        padding: "10px",
                        marginTop: "30px",
                        textAlign: "justify",
                        width: "30%",             // Define a largura do texto como 30%
                        marginRight: "5vw",       // Margem controlada à direita
                        marginTop: "3vw",
                        fontSize: "1em",          // Tamanho de texto fixo para consistência
                    }}
                >
                    <p>{t('biographyPage.generic')}</p>
                </Container>
            </div>
        </>
    );
}

export default GenericIndex;