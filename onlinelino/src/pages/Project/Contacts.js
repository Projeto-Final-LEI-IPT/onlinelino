import React, { useEffect, useState } from "react";
import NavbarHome from "../../components/NavbarHome";
import Container from "react-bootstrap/esm/Container";
import { SERVER_URL } from "../../Utils";
import { ContactsDO } from "../../server/Models/DataObjects";

function Contacts() {
    const [contacts, setContacts] = useState(ContactsDO);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/contactos`);
                if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.error || "Erro ao buscar contactos");
                }
                const data = await response.json();
                setContacts(data || ContactsDO);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
    }, []);

    if (loading) {
        return <h1>Carregando...</h1>;
    }

    if (error) {
        return <h1>Erro: {error}</h1>;
    }

    return (
        <>
            <NavbarHome />
            <br />
            <Container>
                <h4>Contactos</h4>
                <br />
                {contacts.map((item, index) => (
                    <ul key={`contact-${index}`}>
                        <li>{item.nome} - {item.email}</li>
                    </ul>
                ))}
            </Container>
        </>
    );
}

export default Contacts;
