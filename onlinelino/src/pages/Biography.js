import React from "react";
import NavbarHome from "../components/NavbarHome";
import Container from "react-bootstrap/esm/Container";

class BiographyIndex extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return (
            <>
                <NavbarHome />
                <br />
                <Container>
                    <p>Biography</p>
                </Container>
            </>
        );
    }
}

export default BiographyIndex;