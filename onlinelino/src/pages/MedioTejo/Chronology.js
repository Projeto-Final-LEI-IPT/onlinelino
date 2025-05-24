import React from 'react';
import NavbarChronology from "../../components/NavbarChronology";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import '../../style/Chronology.css';

function Chronology() {
    const { t } = useTranslation();

    // array with the list of buildings
    const buildings = [];
    // string with the former color
    let lastColor = "green";

    // object with special cases where the color needs to be the defined
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
        const id = t(`buildings.${i}.id`);
        const title = t(`buildings.${i}.title`);
        const year = t(`buildings.${i}.year`);
        const year2 = t(`buildings.${i}.year2`);
        const imageY = t(`buildings.${i}.images-chrono.0.image`);
        const imageG = t(`buildings.${i}.images-chrono.1.image`);

        // if there is a building
        if (!title.includes("title") && !year.includes("year")) {
            let color, image, color2;

            // if there is a special case, the color ir retrieved from the array
            if (specialCases[i] !== undefined) {
                color = specialCases[i];
            // if not, it gets the last color and sets it accordingly
            } else {
                color = lastColor === "green" ? "yellow" : "green";
            }

            // sets the background color to the image
            color2 = color === "yellow" ? "#d0b598" : "#477263";
            // sets the image to the correct color
            image = color === "yellow" ? imageY : imageG;
            // changes the string lastcolor
            lastColor = color;

            // special case where there is a building with an image in green, but not in yellow
            if (id === 11 && color === "yellow") {
                image = "images-chrono";
            }

            buildings.push({
                id: id,
                title: title,
                year: parseInt(year),
                year2: year + year2,
                imageChrono: image,
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
                        {/* sets logo in the correct space */}
                        {index === 10 && (
                            <div className="image-item-logo">
                                <img src="../img/logo.png" alt="Logo" />
                            </div>
                        )}
                        <Link to={`/obra/${paragraph.id}`} className="image-item" style={{ backgroundColor: paragraph.color2 }}>
                            <div className="image-container">
                                {/* if there isn't an image, the image tag is not shown */}
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

export default Chronology;
