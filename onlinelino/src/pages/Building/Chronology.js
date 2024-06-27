import React from 'react';
import NavbarChronology from "../../components/NavbarChronology";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import '../../style/Chronology.css';

function ChronologyIndex() {
    const { t } = useTranslation();

    const buildings = [];
    let lastColor = "green";

    const specialCases = {
        0: 'yellow',
        6: 'green',
        10: 'yellow',
        11: 'yellow',
        13: 'green',
        15: 'yellow',
        17: 'green',
        23: 'yellow'
    };

    for (let i = 0; i < 50; i++) {
        const title = t(`buildings.${i}.title`);
        const year = t(`buildings.${i}.year`);
        const year2 = t(`buildings.${i}.year2`);
        const imageY = t(`buildings.${i}.images-chrono.0.image`);
        const imageG = t(`buildings.${i}.images-chrono.1.image`);

        if (!title.includes("title") && !year.includes("year")) {
            let color, image, color2;

            if (specialCases[i] !== undefined) {
                color = specialCases[i];
            } else {
                color = lastColor === "green" ? "yellow" : "green";
            }

            color2 = color === "yellow" ? "#d0b598" : "#477263";
            image = color === "yellow" ? imageY : imageG;
            lastColor = color;

            buildings.push({
                title: title,
                year: parseInt(year),
                year2: year + year2,
                imageChrono: image,
                color: color,
                color2: color2
            });
        }
    }
    buildings.sort((a, b) => a.year - b.year);

    return (
        <>
            <NavbarChronology />
            <div className="image-grid">
                {buildings.map((paragraph, index) => (
                    <React.Fragment key={index}>
                        {index === 10 && (
                            <div className="image-item-logo">
                                <img src="../img/logo.png" alt="Logo" />
                            </div>
                        )}
                        <Link to={`/obra/${paragraph.id}`} className="image-item" style={{ backgroundColor: paragraph.color2 }}>
                            <div className="image-container">
                                {!paragraph.imageChrono.includes('images-chrono') && (
                                    <img src={paragraph.imageChrono} alt="" />
                                )}
                                <p className="text-year-chrono">{paragraph.year2}</p>
                            </div>
                        </Link>
                    </React.Fragment>
                ))}
            </div>
        </>
    );
}

export default ChronologyIndex;
