import React from "react";
import NavbarHome from "../components/NavbarHome";
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
                <Container>
                    <p>Contacts</p>
                </Container>
            </>
        );
    }
}

export default ContactsIndex;