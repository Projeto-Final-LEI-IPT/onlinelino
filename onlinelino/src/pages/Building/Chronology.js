import React from 'react';
import NavbarCronology from "../../components/NavbarChronology";
import Container from "react-bootstrap/esm/Container";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import '../../style/Chronology.css';

function ChronologyIndex() {
    const { t } = useTranslation();

    const buildings = [];
    for (let i = 0; i < 50; i++) {
        const title = t(`buildings.${i}.title`);
        const year = t(`buildings.${i}.year`);
        const year2 = t(`buildings.${i}.year2`);
        const image = t(`buildings.${i}.images.0`);
        const image2 = t(`buildings.${i}.images-chrono.0.image`);
        let color = t(`buildings.${i}.images-chrono.0.color`);
        let color2 = ""

        if (!title.includes("title") && !year.includes("year")) {
            if (color.includes("color")) {
                if (buildings[i - 1].color === "green") {
                    color = "yellow";
                    color2 = "#d0b598"
                } else {
                    color = "green";
                    color2 = "#477263"
                }
                if (i === 10) {
                    color = "yellow";
                    color2 = "#d0b598"
                }
            }

            buildings.push({
                title: title,
                year: parseInt(year),
                year2: year + year2,
                image: image,
                imageChrono: image2,
                color: color,
                color2: color2
            });
        }
    }
    buildings.sort((a, b) => a.year - b.year);

    return (
        <>
            <NavbarCronology />
            <br />
            <Container>
                <div className="image-grid">
                    {buildings.map((paragraph, index) => (
                        <React.Fragment key={index}>
                            {index === 10 && (
                                <div className="image-item-logo">
                                    <img src="../img/logo.png" alt="Logo" />
                                </div>
                            )}
                            <Link to={`/obra/${index + 1}`} className="image-item" style={{ backgroundColor: paragraph.color2 }}>
                                <div className="image-container">
                                    {!paragraph.imageChrono.includes('images-chrono') && (
                                        <img src={paragraph.imageChrono} alt="" />
                                    )}
                                    <p className="text-year">{paragraph.year2}</p>
                                </div>
                            </Link>
                        </React.Fragment>
                    ))}
                </div>
            </Container>
        </>
    );
}

export default ChronologyIndex;
