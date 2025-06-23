import { useEffect, useState } from 'react';
import { SERVER_URL, BACKOFFICE_URL, cleanObjectStrings } from "../../../Utils";
import NavbarBackoffice from "../../../components/NavbarBackoffice";
import { Link } from 'react-router-dom';
import '../../../style/Loading.css';


function Buildings() {
  const [edificios, setEdificios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  

  useEffect(() => {
    const fetchEdificios = async () => {
      try {
        const SESSION_TOKEN = localStorage.getItem("authorization");
        const res = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/listaEdificios`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${SESSION_TOKEN}`,
          },
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error);
        }
        let data = await res.json();

        // Limpar tags HTML de todos os campos string de cada objeto
        data = data.map(item => cleanObjectStrings(item));

        data.sort((a, b) =>
          a.data_projeto.localeCompare(b.data_projeto, undefined, { numeric: true })
        );

        setEdificios(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEdificios();
  }, []);

  if (error) return <p>Erro: {error}</p>;

  return (
    <div>
      {loading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            )}
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
          {edificios.map((obra) => (
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