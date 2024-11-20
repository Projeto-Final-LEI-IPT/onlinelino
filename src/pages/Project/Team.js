import React from "react";
import NavbarHome from "../../components/NavbarHome";
import Container from "react-bootstrap/esm/Container";
import { useTranslation } from 'react-i18next';

function TeamIndex() {
    const { t } = useTranslation();
    // teamPage.investigators
    const { t: s } = useTranslation('translation', { keyPrefix: 'teamPage.investigators' });
    const summary = [];
    for (let i = 0; i < 50; i++) {
        if (!s([i]).includes("teamPage.investigators")) {
            summary.push(s([i]));
        }
    }
    // teamPage.collaborators
    const { t: d } = useTranslation('translation', { keyPrefix: 'teamPage.collaborators' });
    const developed = [];
    for (let i = 0; i < 50; i++) {
        if (!d([i]).includes("teamPage.collaborators")) {
            developed.push(d([i]));
        }
    }

    return (
        <>
            <NavbarHome />
            <br />
            <Container>
                <h4>{t('teamPage.team')}</h4>
                <br />
                <h5>{t('teamPage.inv')}</h5>
                {summary.map((paragraph, index) => (
                    <ul key={`ul1-${index}`}>
                        <li key={`sum-${index}`}>{paragraph}</li>
                    </ul>
                ))}
                <hr></hr>
                <h5>{t('teamPage.col')}</h5>
                {developed.map((paragraph, index) => (
                    <ul key={`ul2-${index}`}>
                        <li key={`dev-${index}`}>{paragraph}</li>
                    </ul>
                ))}
            </Container>
        </>
    );
}

export default TeamIndex;