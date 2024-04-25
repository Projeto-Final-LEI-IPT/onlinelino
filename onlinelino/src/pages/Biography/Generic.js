import React from "react";
import NavbarHome from "../../components/NavbarHome";
import NavbarBiography from "../../components/NavbarBiography";
import Container from "react-bootstrap/esm/Container";
import { useTranslation } from 'react-i18next';

function GenericIndex() {
    const { t } = useTranslation();
    // biographyPage.videos
    const { t: v } = useTranslation('translation', { keyPrefix: 'biographyPage.videos' });
    const videos = [];
    for (let i = 0; i < 50; i++) {
        if (!v([i]).includes("biographyPage.videos")) {
            videos.push(v([i]));
        }
    }
    // biographyPage.videosSubtitle
    const { t: s } = useTranslation('translation', { keyPrefix: 'biographyPage.videosSubtitle' });
    const videosSubtitle = [];
    for (let i = 0; i < 50; i++) {
        if (!s([i]).includes("biographyPage.videosSubtitle")) {
            videosSubtitle.push(s([i]));
        }
    }
    // bibliographyPage.otherLinks
    const { t: l } = useTranslation('translation', { keyPrefix: 'biographyPage.otherLinks' });
    const links = [];
    for (let i = 0; i < 50; i++) {
        if (!l([i]).includes("biographyPage.otherLinks")) {
            links.push(l([i]));
        }
    }

    return (
        <>
            <NavbarHome />
            <br />
            <NavbarBiography />
            <br />
            <Container>
                <p>{t('biographyPage.generic')}</p>
                <br />
                <h4>{t('biographyPage.v')}</h4>
                <br />
                <ul>
                    {videos.map((paragraph, index) => (
                        <>
                            <li key={index}>
                                <a href="{paragraph}" target="_blank">
                                    {paragraph}
                                    {/* here */}
                                </a>
                                <br />
                                <span>{videosSubtitle[index]}</span>
                            </li>
                            <br />
                        </>
                    ))}
                </ul>
                <br />
                <h4>{t('biographyPage.l')}</h4>
                <br />
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

export default GenericIndex;