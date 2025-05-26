import React from "react";
import NavbarHome from "../../components/NavbarHome";
import Container from "react-bootstrap/esm/Container";
import { useTranslation } from 'react-i18next';

function Materials() {
    const { t } = useTranslation();


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


    /*return (
        <>
            <NavbarHome />
            <br />
            <Container>
                <p>{t('biographyPage.about')}</p>
            </Container>
        </>
    );*/

    return (
        <>
            <NavbarHome />
            <br />
            <Container>
                <h4>{t('buildingsPage.title')}</h4>
                <br />
                {buildingsProjects.map((paragraph, index) => (
                    <p key={`proj-${index}`}>{paragraph}</p>
                ))}
                <br />
                <h6>{t('biographyPage.v')}</h6>
                <ul>
                    {videos.map((paragraph, index) => (
                        <React.Fragment key={`frag1-${index}`}>
                            <li key={`li1-${index}`}>
                                <a href={paragraph} target="_blank" rel="noreferrer">
                                    {paragraph}
                                </a>
                                <br />
                                <span>{videosSubtitle[index]}</span>
                            </li>
                            <br />
                        </React.Fragment>
                    ))}
                </ul>
                <h6>{t('biographyPage.l')}</h6>
                <ul>
                    {links.map((paragraph, index) => (
                        <React.Fragment key={`frag2-${index}`}>
                            <li key={`li2-${index}`}>
                                <a href={paragraph} target="_blank" rel="noreferrer">
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


export default Materials;