import React, { useEffect, useState } from 'react';
import NavbarChronology from '../../components/NavbarChronology';
import { Link } from 'react-router-dom';
import { SERVER_URL } from '../../Utils';
import '../../style/Chronology.css';

function ChronologyIndex() {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/cronologia`);
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error);
        }
        setBuildings(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const specialCases = {
    0: 'yellow', 6: 'green', 10: 'yellow', 11: 'yellow',
    13: 'green', 15: 'yellow', 17: 'green', 23: 'yellow'
  };

  let lastColor = 'green';
  const prepared = buildings.map((b, index) => {
    const color = specialCases[index] ?? (lastColor === 'green' ? 'yellow' : 'green');
    lastColor = color;
    const bg       = color === 'yellow' ? '#d0b598' : '#477263';
    const imgPath  = color === 'yellow' ? b.imagem_yellow : b.imagem_green;

    return {
      id: b.id,
      yearText: b.data_projeto,
      img: imgPath || '',   
      bg
    };
  });

  prepared.sort((a, b) => a.yearText.localeCompare(b.yearText, undefined, { numeric: true }));

  if (loading) return <h1>Carregando…</h1>;
  if (error)   return <h1>{error}</h1>;

  return (
    <>
      <NavbarChronology />
      <div className="image-grid">
        {prepared.map((p, i) => (
          <React.Fragment key={p.id}>
            {i === 10 && (
              <div className="image-item-logo">
                <img src="../img/logo.png" alt="Logo" />
              </div>
            )}
            <Link to={`/obra/${p.id}`} className="image-item" style={{ backgroundColor: p.bg }}>
              <div className="image-container">
                {p.img && <img src={p.img} alt="" />}
                <p className="text-year-chrono">{p.yearText}</p>
              </div>
            </Link>
          </React.Fragment>
        ))}
      </div>
    </>
  );
}

export default Chronology;
