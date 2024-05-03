import React from "react";
import NavbarHome from "../../components/NavbarHome";
import NavbarBuilding from "../../components/NavbarBuilding";
import Container from "react-bootstrap/esm/Container";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

function ListIndex() {
    const { t } = useTranslation();

    // buildings.[i].title + ", " + buildings.[i].year
    const buildings = [];
    for (let i = 0; i < 50; i++) {
        const title = t(`buildings.${i}.title`);
        const year = t(`buildings.${i}.year`);

        if (!title.includes("title") && !year.includes("year")) {
            buildings.push({
                title: title,
                year: parseInt(year)
            });
        }
    }
    buildings.sort((a, b) => a.year - b.year);

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
                    {buildings.map((paragraph, index) => (
                        <>
                            <Link key={index} to={`/obra/${index + 1}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <li key={index}>{paragraph.title}, {paragraph.year}</li>
                            </Link>
                            <br />
                        </>
                    ))}
                    {/* {buildings} */}
                </ul>
            </Container>
        </>
    );
}

export default ListIndex;
