import React from "react";
import NavbarHome from "../../components/NavbarHome";
import Container from "react-bootstrap/esm/Container";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import '../../style/List.css';

function ListIndex() {
    const { t } = useTranslation();

    // buildings.[i].title + ", " + buildings.[i].year
    const buildings = [];
    for (let i = 0; i < 50; i++) {
        const title = t(`buildings.${i}.title`);
        const year = t(`buildings.${i}.year`);
        const year2 = t(`buildings.${i}.year2`);

        if (!title.includes("title") && !year.includes("year")) {
            buildings.push({
                title: title,
                year: parseInt(year),
                year2: year + year2
            });
        }
    }
    buildings.sort((a, b) => a.year - b.year);

    return (
        <>
            <NavbarHome />
            <br />
            <Container>
                <ul>
                    {buildings.map((paragraph, index) => (
                        <Link key={index} to={`/obra/${index + 1}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <li className="list-item" key={index}>
                                <div className="text-year-list">
                                    <span className="year-highlight">{paragraph.year2}</span>
                                </div>
                                <div className="text-title-list">{paragraph.title}</div>
                            </li>
                        </Link>
                    ))}
                </ul>
            </Container>
        </>
    );
}

export default ListIndex;
