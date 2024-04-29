import React from 'react';
import NavbarHome from "../../components/NavbarHome";
import NavbarBuilding from '../../components/NavbarBuilding';
import Container from "react-bootstrap/esm/Container";
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function BuildingDetails() {
    const { id } = useParams();
    const { t } = useTranslation();

    // buildings.N.info
    let string = "buildings." + (id - 1).toString() + ".info"
    const info = [];
    for (let i = 0; i < 50; i++) {
        if (!t(`buildings.${id - 1}.info.${i}`).includes(string)) {
            info.push(t(`buildings.${id - 1}.info.${i}`));
        }
    }
    // buildings.N.images
    string = "buildings." + (id - 1).toString() + ".images"
    const images = [];
    for (let i = 0; i < 50; i++) {
        if (!t(`buildings.${id - 1}.images.${i}`).includes(string)) {
            images.push(t(`buildings.${id - 1}.images.${i}`));
        }
    }
    // buildings.N.imagesSubtitle
    string = "buildings." + (id - 1).toString() + ".imagesSubtitle"
    const imagesSubtitle = [];
    for (let i = 0; i < 50; i++) {
        if (!t(`buildings.${id - 1}.imagesSubtitle.${i}`).includes(string)) {
            imagesSubtitle.push(t(`buildings.${id - 1}.imagesSubtitle.${i}`));
        }
    }
    // buildings.N.links
    string = "buildings." + (id - 1).toString() + ".links"
    const links = [];
    for (let i = 0; i < 50; i++) {
        if (!t(`buildings.${id - 1}.links.${i}`).includes(string)) {
            links.push(t(`buildings.${id - 1}.links.${i}`));
        }
    }

    if (!id) {
        return <div>Building not found</div>;
    }

    return (
        <>
            <NavbarHome />
            <br />
            <NavbarBuilding />
            <br />
            <Container>
                <h2>{t(`buildings.${id - 1}.title`)}</h2>
                <p>{t('buildingsDetailsPage.year')}: {t(`buildings.${id - 1}.year`)} {t(`buildings.${id - 1}.year2`)}</p>
                <p>{t('buildingsDetailsPage.type')}: {t(`buildings.${id - 1}.typology`)}</p>
                <p>{t('buildingsDetailsPage.location')}: {t(`buildings.${id - 1}.location`)}</p>
                <br />
                {info.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
                <br />
                <p>{t(`buildingsDetailsPage.images`)}:</p>
                {images.map((image, index) => (
                    <div key={index}>
                        <img className="rounded mx-auto d-block" src={image} alt="" style={{ maxWidth: '500px', maxHeight: '500px' }} />
                        <p className="text-center">{imagesSubtitle[index]}</p>
                        <br />
                    </div>
                ))}
                <br />
                <p>{t(`buildingsDetailsPage.links`)}:</p>
                <ul>
                    {links.map((paragraph, index) => (
                        <>
                            <li key={index}>
                                <a href="{paragraph}" target="_blank">
                                    {paragraph}
                                </a>
                            </li>
                            <br />
                        </>
                    ))}
                </ul>

            </Container>
        </>
    );
}

export default BuildingDetails;
