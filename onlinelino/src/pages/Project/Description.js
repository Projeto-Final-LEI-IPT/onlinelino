import NavbarHome from "../../components/NavbarHome";
import Container from "react-bootstrap/esm/Container";
import { useTranslation } from 'react-i18next';
import Footer from "../../components/Footer";

function DescriptionIndex() {
const { t: d } = useTranslation('translation', { keyPrefix: 'descriptionPage.developed' });
    const developed = [];
    for (let i = 0; i < 50; i++) {
        if (!d([i]).includes("descriptionPage.developed")) {
            developed.push(d([i]));
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
            {/* Contêiner flexível para empilhar os elementos */}
            <div
                style={{
                    display: "flex",            // Utiliza Flexbox
                    flexDirection: "column",    // Alinha os itens verticalmente
                    maxHeight: "100vh",         // Garante que o contêiner ocupe toda a altura da página
                }}
            >
                {/* Imagem de fundo */}
                <div
                    style={{
                    position: "absolute", // A imagem de fundo será posicionada de forma absoluta
                    top: 0, // Posiciona no topo do contêiner
                    left: 0,
                    bottom:0,
                    right:0,
                    width: "100%", // Largura 100% da tela
                    height: "100%", // Altura 100% da tela
                    backgroundImage: "url('/img/fundo_descricao.jpg')",
                    backgroundSize: "cover", // A imagem cobre toda a área disponível
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center", // A imagem será centrada
                    zIndex: -1, // Coloca a imagem de fundo atrás do conteúdo
                    }}
                />

                {/* Conteúdo com o Container */}
                <Container
                    style={{
                        flex: 1,
                        backgroundColor: "rgba(234, 216, 193, 0.8)",  // O conteúdo ocupará o espaço restante
                        zIndex: 1, 
                        paddingTop: "10px",
                        paddingLeft:"50px",
                        marginTop: "30px",
                        textAlign:"justify",
                        marginRight: "0vh", // Garante que o conteúdo fique acima da imagem
                    }}
                >
                    {developed.map((paragraph, index) => (
                        <p key={index} style={{ marginBottom: "1rem" }}>{paragraph}</p>
                    ))}
                </Container>
                <Footer/>
            </div>
        </>
    );
}
export default DescriptionIndex;