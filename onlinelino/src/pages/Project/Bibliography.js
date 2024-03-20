import React from "react";
import NavbarHome from "../../components/NavbarHome";
import NavbarProject from "../../components/NavbarProject";
import Container from "react-bootstrap/esm/Container";

class BibliographyIndex extends React.Component {
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
                    <p>Bibliografia</p>
                </Container>
            </>
        );
    }
}

export default BibliographyIndex;