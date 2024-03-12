import React from "react";
import NavbarHome from "../components/NavbarHome";
import Container from "react-bootstrap/esm/Container";

/**
 * Component that represents the home page
 */
class BiographyIndex extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

    // method to render the component
    render() {
        return (
            // Navbar by MerakiUI
            // *adpated to our needs
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