import React from 'react';
import NavbarChronology from "../../components/NavbarChronology";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import '../../style/Chronology.css';

function ChronologyIndex() {
    const { t } = useTranslation();

    const buildings = [];
    let lastColor = "green";

    for (let i = 0; i < 50; i++) {
        const id = t(`buildings.${i}.id`);
        const title = t(`buildings.${i}.title`);
        const year = t(`buildings.${i}.year`);
        const year2 = t(`buildings.${i}.year2`);
        const imageY = t(`buildings.${i}.images-chrono.0.image`);
        const imageG = t(`buildings.${i}.images-chrono.1.image`);

        if (!title.includes("title") && !year.includes("year")) {
            let color, image, color2;

            switch (id) {
                case 1:
                    color = "yellow";
                    color2 = "#d0b598";
                    image = imageY;
                    lastColor = "yellow";
                    break;
                case 7:
                    color = "green";
                    color2 = "#477263";
                    image = imageG;
                    lastColor = "green";
                    break;
                case 11:
                    color = "yellow";
                    color2 = "#d0b598";
                    image = "images-chrono";
                    lastColor = "yellow";
                    break;
                case 12:
                    color = "yellow";
                    color2 = "#d0b598";
                    image = imageY;
                    lastColor = "yellow";
                    break;
                case 14:
                    color = "green";
                    color2 = "#477263";
                    image = imageG;
                    lastColor = "green";
                    break;
                case 16:
                    color = "yellow";
                    color2 = "#d0b598";
                    image = imageY;
                    lastColor = "yellow";
                    break;
                case 18:
                    color = "green";
                    color2 = "#477263";
                    image = imageG;
                    lastColor = "green";
                    break;
                case 24:
                    color = "yellow";
                    color2 = "#d0b598";
                    image = imageY;
                    lastColor = "yellow";
                    break;
                default:
                    if (lastColor === "green") {
                        color = "yellow";
                        color2 = "#d0b598";
                        image = imageY;
                        lastColor = "yellow";
                    } else if (lastColor === "yellow") {
                        color = "green";
                        color2 = "#477263";
                        image = imageG;
                        lastColor = "green";
                    }
            }

            buildings.push({
                id: id,
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
