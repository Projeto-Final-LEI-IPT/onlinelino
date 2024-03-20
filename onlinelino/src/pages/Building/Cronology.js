import React from 'react';
import NavbarHome from "../../components/NavbarHome";
import NavbarBuilding from '../../components/NavbarBuilding';
import Timeline from "../../components/Timeline";
import Container from "react-bootstrap/esm/Container";

class CronologyIndex extends React.Component {
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
                    <Timeline />
                </Container>
            </>
        );
    }
}

export default CronologyIndex;