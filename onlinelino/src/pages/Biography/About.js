import React from "react";
import NavbarHome from "../../components/NavbarHome";
import NavbarBiography from "../../components/NavbarBiography";
import Container from "react-bootstrap/esm/Container";

class AboutIndex extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return (
            <>
                <NavbarHome />
                <br />
                <NavbarBiography />
                <br />
                <Container>
                    <p>Sobre o trabalho no Medio Tejo</p>
                </Container>
            </>
        );
    }
}

export default AboutIndex;