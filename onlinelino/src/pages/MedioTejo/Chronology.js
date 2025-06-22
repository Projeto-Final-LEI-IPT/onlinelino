import React, { useEffect, useState } from 'react';
import NavbarChronology from '../../components/NavbarChronology';
import { Link } from 'react-router-dom';
import { SERVER_URL, removeHtmlTags } from '../../Utils';
import '../../style/Chronology.css';

// Hook para pegar largura da janela e atualizar no resize
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
}

function Chronology() {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const windowWidth = useWindowWidth();

  // Define colunas conforme largura da tela
  const getColumnsCount = (width) => {
    if (width <= 480) return 1; 
    if (width <= 768) return 3; 
    if (width <= 1024) return 5; 
    return 7; 
  };

  const columns = getColumnsCount(windowWidth);

  const specialIndex = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/cronologia`);
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error);
        }
        const data = await res.json()
        setBuildings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const sortedBuildings = [...buildings].sort((a, b) => {
  const aClean = removeHtmlTags(a.data_projeto || '');
  const bClean = removeHtmlTags(b.data_projeto || '');
  return aClean.localeCompare(bClean, undefined, { numeric: true });
});


  const isGreenAtSpecial = specialIndex % 2 === 0;
  const specialBg = isGreenAtSpecial ? '#477263' : '#d0b598';

  // +1 para o quadrado contendo o nome do projeto
  const totalItems = sortedBuildings.length + 1; 
  const prepared = [];

  let buildingIndex = 0;

  for (let i = 0; i < totalItems; i++) {
    if (i === specialIndex) {
      prepared.push({
        id: 'special-logo',
        yearText: '',
        img: '../img/logo.png',
        bg: specialBg,
        isSpecialLogo: true,
      });
    } else {
      const building = sortedBuildings[buildingIndex];
      if (building) {
        const isGreen = i % 2 === 0;
        const bg = isGreen ? '#477263' : '#d0b598';
        const imgPath = isGreen ? building.imagem_green : building.imagem_yellow;

        prepared.push({
          id: building.id,
          yearText: removeHtmlTags(building.data_projeto),
          img: imgPath || '',
          bg,
          isSpecialLogo: false,
        });
        buildingIndex++;
      } else {
        break;
      }
    }
  }

  // Ajustar preenchimento para completar a última linha com base nas colunas atuais
  const remainder = prepared.length % columns;
  if (remainder !== 0) {
    const needed = columns - remainder;
    let startIndex = prepared.length;
    for (let k = 0; k < needed; k++) {
      const isGreen = (startIndex + k) % 2 === 0;
      const bg = isGreen ? '#477263' : '#d0b598';

      prepared.push({
        id: `placeholder-${k}`,
        yearText: '',
        img: '',
        bg,
        isSpecialLogo: false,
        isPlaceholder: true,
      });
    }
  }

  if (loading) return <h1>Carregando…</h1>;
  if (error) return <h1>{error}</h1>;

  return (
    <>
      <NavbarChronology />
      <div className="image-grid">
        {prepared.map((p) =>
          p.isSpecialLogo ? (
            <div
              key={p.id}
              className="image-item-logo"
              style={{ backgroundColor: p.bg }}
            >
              <img src={p.img} alt="Logo" />
            </div>
          ) : p.isPlaceholder ? (
            <div
              key={p.id}
              className="image-item"
              style={{ backgroundColor: p.bg }}
            />
          ) : (
            <Link
              key={p.id}
              to={`/MedioTejo/${p.id}`}
              className="image-item"
              style={{ backgroundColor: p.bg }}
            >
              <div className="image-container">
                {p.img && <img src={p.img} alt="" />}
                <p className="text-year-chrono">{p.yearText}</p>
              </div>
            </Link>
          )
        )}
      </div>
    </>
  );
}

export default Chronology;
