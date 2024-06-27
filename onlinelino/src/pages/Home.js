import React from "react";
import NavbarHome from "../components/NavbarHome";
import Footer from "../components/Footer";
import Container from "react-bootstrap/esm/Container";
import { useTranslation } from 'react-i18next';

function Home() {
    // homePage.summary
    const { t: s } = useTranslation('translation', { keyPrefix: 'homePage.summary' });
    const summary = [];
    for (let i = 0; i < 50; i++) {
        if (!s([i]).includes("homePage.summary")) {
            summary.push(s([i]));
        }
    }

    return (
        <>
            <NavbarHome />
            <br />
            <Container>
                {summary.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </Container>
            <Footer />
        </>
    );
}

export default Home;