import React from "react";
import NavbarHome from "../components/NavbarHome";
import NavbarProject from "../components/NavbarProject";
import Container from "react-bootstrap/esm/Container";

class Home extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return (
            <>
                <NavbarHome />
                <br />
                <NavbarProject />
                <br />
                <Container>
                    <p>Página inicial</p>
                    <p>Fotografia e nome e hiperligação para a biografia</p>
                    <p>Breve descrição do projeto</p>
                    <p>Uma página mais gráfica, tipo capa</p>
                </Container>
            </>
        );
    }
}

export default Home;