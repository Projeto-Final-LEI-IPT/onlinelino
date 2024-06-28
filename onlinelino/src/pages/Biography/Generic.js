import React from "react";
import NavbarHome from "../../components/NavbarHome";
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
            <Container>
                <p>{t('biographyPage.generic')}</p>
                <br />
                <h4>{t('biographyPage.v')}</h4>
                <br />
                <ul>
                    {videos.map((paragraph, index) => (
                        <React.Fragment key={`frag1-${index}`}>
                            <li key={`li1-${index}`}>
                                <a href="{paragraph}" target="_blank">
                                    {paragraph}
                                </a>
                                <br />
                                <span>{videosSubtitle[index]}</span>
                            </li>
                            <br />
                        </React.Fragment>
                    ))}
                </ul>
                <br />
                <h4>{t('biographyPage.l')}</h4>
                <br />
                <ul>
                    {links.map((paragraph, index) => (
                        <React.Fragment key={`frag1-${index}`}>
                            <li key={`li2-${index}`}>
                                <a href="{paragraph}" target="_blank">
                                    {paragraph}
                                </a>
                            </li>
                            <br />
                        </React.Fragment>
                    ))}
                </ul>
            </Container>
        </>
    );
}

export default GenericIndex;