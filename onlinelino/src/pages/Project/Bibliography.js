import React from "react";
import NavbarHome from "../../components/NavbarHome";
import NavbarProject from "../../components/NavbarProject";
import Container from "react-bootstrap/esm/Container";
import { useTranslation } from 'react-i18next';

function BibliographyIndex() {
    // bibliographyPage.text
    const { t: text } = useTranslation('translation', { keyPrefix: 'bibliographyPage.text' });
    const b = [];
    for (let i = 0; i < 50; i++) {
        if (!text([i]).includes("bibliographyPage.text")) {
            b.push(text([i]));
        }
    }
    // bibliographyPage.biography
    const { t } = useTranslation();

    return (
        <>
            <NavbarHome />
            <br />
            <NavbarProject />
            <br />
            <Container>
                <h4>{t('bibliographyPage.bibliography')}</h4>
                <br/>
                <ul>
                    {b.map((paragraph, index) => (
                        <>
                            <li key={index}>{paragraph}</li>
                            <br />
                        </>
                    ))}
                </ul>
            </Container>
        </>
    );
}

export default BibliographyIndex;