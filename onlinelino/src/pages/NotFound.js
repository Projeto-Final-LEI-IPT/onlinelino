import { useEffect } from "react";
import Container from "react-bootstrap/esm/Container";
import NavbarHome from "../components/NavbarHome";
import Footer from "../components/Footer";
import "../style/Loading.css";

function NotFound() {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <>
      <NavbarHome />
      <div
        style={{
          backgroundImage: "url('/img/fundo_descricao.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            padding: "2rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Container
            style={{
              backgroundColor: "rgba(234, 216, 193, 0.85)",
              padding: "2rem",
              borderRadius: "12px",
              textAlign: "center",
              maxWidth: "500px",
            }}
          >
            <h1 style={{ fontSize: "5rem", marginBottom: "1rem", color: "#333" }}>
              404
            </h1>
            <h2 style={{ fontSize: "1.75rem", color: "#444" }}>
              OOPS! Página inválida.
            </h2>
          </Container>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default NotFound;
