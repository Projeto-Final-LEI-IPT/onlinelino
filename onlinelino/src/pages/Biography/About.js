import React from "react";
import NavbarHome from "../../components/NavbarHome";
import NavbarBiography from "../../components/NavbarBiography";
import Container from "react-bootstrap/esm/Container";
import { useTranslation } from 'react-i18next';

function AboutIndex() {
    const { t } = useTranslation();
    return (
        <>
            <NavbarHome />
            <br />
            <NavbarBiography />
            <br />
            <Container>
                <p>{t('biographyPage.about')}</p>
            </Container>
        </>
    );
}


export default AboutIndex;