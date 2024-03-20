import React from "react";
import NavbarHome from "../../components/NavbarHome";
import NavbarBuilding from "../../components/NavbarBuilding";
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
                <NavbarBuilding />
                <br />
                <Container>
                    <p>Mapa</p>
                </Container>
            </>
        );
    }
}

export default MapIndex;