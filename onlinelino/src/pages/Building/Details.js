import React from 'react';
import NavbarHome from "../../components/NavbarHome";
import NavbarBuilding from '../../components/NavbarBuilding';
import Container from "react-bootstrap/esm/Container";
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function BuildingDetails() {
    const { id } = useParams();
    const { t } = useTranslation();
    let string = "";

    // buildings.N.info
    string = "buildings." + (id - 1).toString() + ".info"
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
    // buildings.N.links.I.fonte
    const links = [];
    for (let i = 0; i < 50; i++) {
        const fonte = t(`buildings.${id - 1}.links.${i}.fonte`);
        if (!fonte.includes("fonte")) {
            const biblio = [];
            for (let j = 0; j < 50; j++) {
                const text = t(`buildings.${id - 1}.links.${i}.biblio.${j}.text`);
                const link = t(`buildings.${id - 1}.links.${i}.biblio.${j}.links`);

                if (!text.includes("text") && !link.includes("links")) {
                    biblio.push({
                        text: text,
                        link: link
                    });
                }
            }
            links.push({
                fonte: fonte,
                biblio: biblio
            });
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
                    <p key={`info-${index}`}>{paragraph}</p>
                ))}
                <br />
                {images.length > 0 && (
                    <p>{t(`buildingsDetailsPage.images`)}:</p>
                )}
                {images.map((image, index) => (
                    <div key={`img-${index}`}>
                        <img className="rounded mx-auto d-block" src={image} alt="" style={{ maxWidth: '500px', maxHeight: '500px' }} />
                        <p className="text-center">{imagesSubtitle[index]}</p>
                        <br />
                    </div>
                ))}
                <br />
                <p>{t(`buildingsDetailsPage.bibliography`)}:</p>
                <ul>
                    {links.map((linkItem, linkIndex) => (
                        <li key={`link-${linkIndex}`}>
                            {linkItem.fonte}
                            <ul>
                                {linkItem.biblio.map((biblioItem, biblioIndex) => (
                                    <>
                                        <li key={`biblio-${linkIndex}-${biblioIndex}`}>
                                            <a href={biblioItem.link} target="_blank" rel="noopener noreferrer">
                                                {biblioItem.text}
                                            </a>
                                        </li>
                                    </>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </Container>
        </>
    );
}

export default BuildingDetails;
