import React from 'react';
import NavbarHome from "../../components/NavbarHome";
import NavbarBuilding from '../../components/NavbarBuilding';
import Container from "react-bootstrap/esm/Container";

class BuildingIndex extends React.Component {
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
                    <p>Index</p>
                </Container>
            </>
        );
    }
}

export default BuildingIndex;