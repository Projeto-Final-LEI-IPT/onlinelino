import React from "react";
import NavbarHome from "../components/NavbarHome";
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
    // homePage.developed
    const { t: d } = useTranslation('translation', { keyPrefix: 'homePage.developed' });
    const developed = [];
    for (let i = 0; i < 50; i++) {
        if (!d([i]).includes("homePage.developed")) {
            developed.push(d([i]));
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
                <hr></hr>
                {developed.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </Container>
        </>
    );
}

export default Home;