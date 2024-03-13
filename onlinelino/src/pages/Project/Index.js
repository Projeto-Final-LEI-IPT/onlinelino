import React from 'react';
import NavbarHome from "../../components/NavbarHome";
import NavbarProject from "../../components/NavbarProject";
import Timeline from "../../components/Timeline";
import Container from "react-bootstrap/esm/Container";

class ProjectIndex extends React.Component {
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
                    <Timeline />
                </Container>
                

            </>
        );
    }
}

export default ProjectIndex;