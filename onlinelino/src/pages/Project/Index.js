import React from 'react';
import NavbarProject from "../../components/NavbarProject";
import NavbarHome from "../../components/NavbarHome";


class ProjectIndex extends React.Component {
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
            </>
        );
    }
}

export default ProjectIndex;