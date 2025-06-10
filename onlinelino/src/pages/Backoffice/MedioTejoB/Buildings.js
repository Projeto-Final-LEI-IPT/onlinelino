import React, { useEffect, useState } from 'react';
import { BACKOFFICE_URL, SERVER_URL } from "../../../Utils";
import NavbarBackoffice from "../../../components/NavbarBackoffice";
import { Link } from 'react-router-dom'


function Buildings() {
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

  if (loading) return <p>Carregando…</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div>
        <NavbarBackoffice />
        <h2 className="title">Lista de Edificios</h2>
         <ul >
      {works.map((obra) => (
        <li key={obra.id}  style={{ marginBottom: '10px' }}>
          <Link to={`/Backoffice/MedioTejoB/${obra.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            {obra.titulo}
          </Link>
        </li>
      ))}
    </ul>
    </div>
  );
}

export default Buildings;