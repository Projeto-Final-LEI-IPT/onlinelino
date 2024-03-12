import React from "react";
import NavbarHome from "../../components/NavbarHome";
import NavbarProject from "../../components/NavbarProject";
import Container from "react-bootstrap/esm/Container";

/**
 * Component that represents the home page
 */
class BibliographyIndex extends React.Component {
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
                <NavbarProject />
                <br />
                <Container>
                    <p>Bibliography</p>
                </Container>
            </>
        );
    }
}

export default BibliographyIndex;