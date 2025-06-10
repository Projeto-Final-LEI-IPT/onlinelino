import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SERVER_URL } from '../../Utils';
import NavbarHome from '../../components/NavbarHome';
import '../../style/List.css';


function ListIndex() {
    const [works, setWorks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchWorks = async () => {
            try {
                const res = await fetch(`${SERVER_URL}/listaObras`);
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error);
                }
                const data = await res.json();

                // Ordenar por data 
                data.sort((a, b) =>
                    a.data_projeto.localeCompare(b.data_projeto, undefined, { numeric: true })
                );

                setWorks(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWorks();
    }, []);

    if (loading) return <h1>Carregando…</h1>;
    if (error) return <h1>{error}</h1>;

    return (
        <>
            <NavbarHome />
            <div style={{
                    backgroundImage: "url('/img/fundo_descricao.webp')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    minHeight: "100vh",
                    paddingTop: "2rem",
                    paddingBottom: "2rem",
                }}>
            <div className="container"
            style={{
                        backgroundColor: "rgba(234, 216, 193, 0.85)",
                        padding: "2rem",
                        marginLeft: "auto",
                        marginRight: "0",
                    }}>
                <ul className="two-column-list">
                    {works.map((obra) => (
                        <Link
                            to={`/MedioTejo/${obra.id}`}
                            key={obra.id}
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <li className="list-item">
                                <div className="text-year-list">
                                    <span className="year-highlight">{obra.data_projeto}</span>
                                </div>
                                <div className="text-title-list">{obra.titulo}</div>
                            </li>
                        </Link>
                    ))}
                </ul>
            </div>
            </div>
        </>
    );
}

export default ListIndex;
