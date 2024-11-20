import React from "react";
import NavbarHome from "../../components/NavbarHome";
import Container from "react-bootstrap/esm/Container";
import { useTranslation } from 'react-i18next';

function ContactsIndex() {
    // contactsPage.text
    const { t: c } = useTranslation('translation', { keyPrefix: 'contactsPage.text' });
    const contacts = [];
    for (let i = 0; i < 50; i++) {
        if (!c([i]).includes("contactsPage.text")) {
            contacts.push(c([i]));
        }
    }
    // bibliographyPage.biography
    const { t } = useTranslation();

    return (
        <>
            <NavbarHome />
            <br />
            <Container>
                <h4>{t('contactsPage.contacts')}</h4>
                <br />
                <ul>
                    {contacts.map((paragraph, index) => (
                        <React.Fragment key={`li-${index}`}>
                            <li key={`contact-${index}`}>{paragraph}</li>
                            <br />
                        </React.Fragment>
                    ))}
                </ul>
            </Container>
        </>
    );
}

export default ContactsIndex;