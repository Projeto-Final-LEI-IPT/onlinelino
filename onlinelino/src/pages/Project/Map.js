import React from "react";
import NavbarHome from "../../components/NavbarHome";
import NavbarProject from "../../components/NavbarProject";
import Container from "react-bootstrap/esm/Container";

class MapIndex extends React.Component {
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
                    <p>Map</p>
                </Container>
            </>
        );
    }
}

export default MapIndex;