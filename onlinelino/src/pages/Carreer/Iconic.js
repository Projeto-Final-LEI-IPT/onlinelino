import React from "react";
import NavbarHome from "../../components/NavbarHome";
import Container from "react-bootstrap/esm/Container";
import { useTranslation } from 'react-i18next';

function Iconic() {
    // biographyPage.videos
    const { t: v } = useTranslation('translation', { keyPrefix: 'biographyPage.videos' });
    const videos = [];
    for (let i = 0; i < 50; i++) {
        if (!v([i]).includes("biographyPage.videos")) {
            videos.push(v([i]));
        }
    }
    // biographyPage.videosSubtitle
    const { t: s } = useTranslation('translation', { keyPrefix: 'biographyPage.videosSubtitle' });
    const videosSubtitle = [];
    for (let i = 0; i < 50; i++) {
        if (!s([i]).includes("biographyPage.videosSubtitle")) {
            videosSubtitle.push(s([i]));
        }
    }
    // bibliographyPage.otherLinks
    const { t: l } = useTranslation('translation', { keyPrefix: 'biographyPage.otherLinks' });
    const links = [];
    for (let i = 0; i < 50; i++) {
        if (!l([i]).includes("biographyPage.otherLinks")) {
            links.push(l([i]));
        }
    }

    return (
        <>
            <NavbarHome />
            <div style={{ overflow: "hidden", }}>
                <div
                    style={{
                        backgroundImage: "url('/img/RL_FOTO1.jpg')",
                        backgroundSize: "cover",                  // cobre toda a área
                        backgroundPosition: "right center",      // sempre centralizado
                        backgroundRepeat: "no-repeat",            // não repete
                        backgroundAttachment: "scroll",           // comportamento padrão
                        minHeight: "100vh",                       // altura mínima de 100% da janela
                        display: "flex",                          // centra verticalmente (opcional)
                        justifyContent: "flex-end",               // alinha container à direita
                        alignItems: "center",                     // alinha verticalmente
                        paddingTop: "0rem",
                        paddingBottom: "2rem",
                    }}
                >
                    <Container
                        style={{
                            backgroundColor: "rgba(234, 216, 193, 0.85)",
                            padding: "2rem",
                            marginLeft: "auto",
                            marginRight: "3%",
                            maxWidth: "600px",  // limita a largura máxima
                            width: "100%",
                        }}>

                    </Container>
                </div>
            </div>
        </>
    );
}

export default Iconic;