import React from "react";
import NavbarHome from "../../components/NavbarHome";
import NavbarBuilding from "../../components/NavbarBuilding";
import Container from "react-bootstrap/esm/Container";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

function ListIndex() {
    const { t } = useTranslation();

    // buildings.[i].title + ", " + buildings.[i].year
    const list = [];
    for (let i = 0; i < 50; i++) {
        if (!t(`buildings.${i}.title`).includes("title") && !t(`buildings.${i}.year`).includes("year")) {
            list.push(t(`buildings.${i}.title`).toString() + ", " + t(`buildings.${i}.year`).toString());
        }
    }

    return (
        <>
            <NavbarHome />
            <br />
            <NavbarBuilding />
            <br />
            <Container>
                <h4>{t('listPage.title')}</h4>
                <br />
                <ul>
                    {list.map((paragraph, index) => (
                        <>
                            <Link key={index} to={`/obra/${index + 1}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <li key={index}>{paragraph}</li>
                            </Link>
                            <br />
                        </>
                    ))}
                </ul>
            </Container>
        </>
    );
}

export default ListIndex;
