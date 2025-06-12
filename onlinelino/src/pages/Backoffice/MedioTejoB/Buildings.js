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
    
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      minHeight: '100vh',
      padding: '2rem',
      backgroundColor: '#f5f5f5'
    }}>
      <h2 className="title" style={{ marginBottom: '1.5rem' }}>Lista de Edifícios</h2>

      <ul style={{
        listStyle: 'none',
        padding: 0,
        width: '100%',
        maxWidth: '600px'
      }}>
        {works.map((obra) => (
          <li key={obra.id} style={{ marginBottom: '15px' }}>
            <Link
              to={`/Backoffice/MedioTejoB/${obra.id}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#fff',
                padding: '12px 16px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <span style={{ fontWeight: 'bold', color: '#777' }}>{obra.data_projeto}</span>
              <span>{obra.titulo}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

}

export default Buildings;