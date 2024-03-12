import React from "react";
import NavbarHome from "../components/NavbarHome";
import Container from "react-bootstrap/esm/Container";

class TeamIndex extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return (
            <>
                <NavbarHome />
                <br />
                <Container>
                    <p>Team</p>
                </Container>
            </>
        );
    }
}

export default TeamIndex;