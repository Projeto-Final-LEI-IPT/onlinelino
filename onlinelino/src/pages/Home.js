import React from "react";
import NavbarHome from "../components/NavbarHome";

/**
 * Component that represents the home page
 */
class Home extends React.Component {
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
            </>
        );
    }
}

export default Home;