import React from "react";
import NavbarHome from "../../components/NavbarHome";
import Container from "react-bootstrap/esm/Container";
import { useTranslation } from 'react-i18next';

function DescriptionIndex() {

    // descriptionPage.developed
    const { t: d } = useTranslation('translation', { keyPrefix: 'descriptionPage.developed' });
    const developed = [];
    for (let i = 0; i < 50; i++) {
        if (!d([i]).includes("descriptionPage.developed")) {
            developed.push(d([i]));
        }
    }
    
    return (
        <>
            <NavbarHome />
            <br />
            <Container>
                {developed.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </Container>
        </>
    );
}


export default DescriptionIndex;