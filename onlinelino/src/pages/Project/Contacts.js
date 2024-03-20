import React from "react";
import NavbarHome from "../../components/NavbarHome";
import NavbarProject from "../../components/NavbarProject";
import Container from "react-bootstrap/esm/Container";

class ContactsIndex extends React.Component {
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
                    <p>Contactos</p>
                </Container>
            </>
        );
    }
}

export default ContactsIndex;