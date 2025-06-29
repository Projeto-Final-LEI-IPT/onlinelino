import React, { useEffect, useState } from 'react';
import NavbarChronology from '../../components/NavbarChronology';
import { Link } from 'react-router-dom';
import { SERVER_URL, removeHtmlTags } from '../../Utils';
import '../../style/Chronology.css';
import '../../style/Loading.css';
import ModalMessage from '../../components/ModalMessage'; 

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
  const [edificios, setEdificios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false); 

  const windowWidth = useWindowWidth();

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
          throw new Error(err.error || 'Erro ao buscar cronologia');
        }
        const data = await res.json();
        setEdificios(data);
      } catch (err) {
        setError(err.message);
        setModalOpen(true); 
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const sortedEdificios = [...edificios].sort((a, b) => {
    const aClean = removeHtmlTags(a.data_projeto || '');
    const bClean = removeHtmlTags(b.data_projeto || '');
    return aClean.localeCompare(bClean, undefined, { numeric: true });
  });

  const isGreenAtSpecial = specialIndex % 2 === 0;
  const specialBg = isGreenAtSpecial ? '#477263' : '#d0b598';
  const totalItems = sortedEdificios.length + 1;
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
      const building = sortedEdificios[buildingIndex];
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

  return (
    <>
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      <ModalMessage
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Erro interno."
        message={'Por favor, tente novamente mais tarde.'}
        type="error"
        action={{
          label: 'Fechar',
          onClick: () => setModalOpen(false),
        }}
      />

      <NavbarChronology />
      <div className="image-grid">
        {prepared.map((p) =>
          p.isSpecialLogo ? (
            <div
              key={p.id}
              className="image-item-logo"
              style={{ backgroundColor: p.bg }}
            >
              {p.img ? (
                <img src={p.img} alt="Logo" loading="lazy" />
              ) : null}
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
                {p.img ? (
                  <img src={p.img} alt="" loading="lazy" />
                ) : null}
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
