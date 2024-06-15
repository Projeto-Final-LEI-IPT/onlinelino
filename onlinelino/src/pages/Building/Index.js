import React from 'react';
import NavbarHome from "../../components/NavbarHome";
import Container from "react-bootstrap/esm/Container";

import { useTranslation } from 'react-i18next';

function BuildingIndex() {
    const { t } = useTranslation();
    // buildingsPage.buildingsProjects
    const { t: b } = useTranslation('translation', { keyPrefix: 'buildingsPage.buildingsProjects' });
    const buildingsProjects = [];
    for (let i = 0; i < 50; i++) {
        if (!b([i]).includes("buildingsPage.buildingsProjects")) {
            buildingsProjects.push(b([i]));
        }
    }
    // buildingsPage.videos
    const { t: v } = useTranslation('translation', { keyPrefix: 'buildingsPage.videos' });
    const videos = [];
    for (let i = 0; i < 50; i++) {
        if (!v([i]).includes("buildingsPage.videos")) {
            videos.push(v([i]));
        }
    }
    // buildingsPage.videosSubtitle
    const { t: s } = useTranslation('translation', { keyPrefix: 'buildingsPage.videosSubtitle' });
    const videosSubtitle = [];
    for (let i = 0; i < 50; i++) {
        if (!s([i]).includes("buildingsPage.videosSubtitle")) {
            videosSubtitle.push(s([i]));
        }
    }
    // buildingsPage.otherLinks
    const { t: l } = useTranslation('translation', { keyPrefix: 'buildingsPage.otherLinks' });
    const links = [];
    for (let i = 0; i < 50; i++) {
        if (!l([i]).includes("buildingsPage.otherLinks")) {
            links.push(l([i]));
        }
    }
    // buildingsPage.buildingsProjectsMedioTejo
    const { t: m } = useTranslation('translation', { keyPrefix: 'buildingsPage.buildingsProjectsMedioTejo' });
    const medioTejo = [];
    for (let i = 0; i < 50; i++) {
        if (!m([i]).includes("buildingsPage.buildingsProjectsMedioTejo")) {
            medioTejo.push(m([i]));
        }
    }
    // buildingsPage.images
    const { t: f } = useTranslation('translation', { keyPrefix: 'buildingsPage.images' });
    const images = [];
    for (let i = 0; i < 50; i++) {
        if (!f([i]).includes("buildingsPage.images")) {
            images.push(f([i]));
        }
    }
    // buildingsPage.imagesSubtitle
    const { t: s2 } = useTranslation('translation', { keyPrefix: 'buildingsPage.imagesSubtitle' });
    const imagesSubtitle = [];
    for (let i = 0; i < 50; i++) {
        if (!s2([i]).includes("buildingsPage.imagesSubtitle")) {
            imagesSubtitle.push(s2([i]));
        }
    }
    return (
        <>
            <NavbarHome />
            <br />
            <Container>
                <h4>{t('buildingsPage.title')}</h4>
                <br />
                {buildingsProjects.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
                <br />
                <h6>{t('biographyPage.v')}</h6>
                <ul>
                    {videos.map((paragraph, index) => (
                        <>
                            <li key={index}>
                                <a href={paragraph} target="_blank" rel="noreferrer">
                                    {paragraph}
                                </a>
                                <br />
                                <span>{videosSubtitle[index]}</span>
                            </li>
                            <br />
                        </>
                    ))}
                </ul>
                <h6>{t('biographyPage.l')}</h6>
                <ul>
                    {links.map((paragraph, index) => (
                        <>
                            <li key={index}>
                                <a href={paragraph} target="_blank" rel="noreferrer">
                                    {paragraph}
                                </a>
                            </li>
                            <br />
                        </>
                    ))}
                </ul>
                <h4>{t('buildingsPage.title2')}</h4>
                <br />
                {medioTejo.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
                <br />
                {images.map((paragraph, index) => (
                    <>
                    <img key={index} className="rounded mx-auto d-block" src={paragraph} alt="" style={{ maxWidth: '500px', maxHeight: '500px' }}/>
                    <p key={index} className="text-center">{imagesSubtitle[index]}</p>
                    <br/>
                    </>
                ))}
            </Container>
        </>
    );
}


export default BuildingIndex;