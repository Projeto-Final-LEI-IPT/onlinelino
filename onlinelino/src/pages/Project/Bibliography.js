import React from "react";
import NavbarHome from "../../components/NavbarHome";
import Container from "react-bootstrap/esm/Container";
import { useTranslation } from 'react-i18next';

function BibliographyIndex() {
    // bibliographyPage.text
    const { t: b } = useTranslation('translation', { keyPrefix: 'bibliographyPage.text' });
    const text = [];
    for (let i = 0; i < 50; i++) {
        if (!b([i]).includes("bibliographyPage.text")) {
            text.push(b([i]));
        }
    }
    // bibliographyPage.biography
    const { t } = useTranslation();

    return (
        <>
            <NavbarHome />
            <br />
            <Container>
                <h4>{t('bibliographyPage.bibliography')}</h4>
                <br/>
                <ul>
                    {text.map((paragraph, index) => (
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