import React from "react";
import NavbarHome from "../../components/NavbarHome";
import Container from "react-bootstrap/esm/Container";
import { useTranslation } from 'react-i18next';

function AboutIndex() {
    const { t } = useTranslation();
    return (
        <>
            <NavbarHome />
            <br />
            <Container>
                <p>{t('biographyPage.about')}</p>
            </Container>
        </>
    );
}


export default AboutIndex;