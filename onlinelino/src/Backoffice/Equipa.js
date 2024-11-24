import React, { useState, useEffect } from 'react';

const EquipaTest = () => {
  const [equipa, setEquipa] = useState([]); 
  const [error, setError] = useState(null);

  //GET da Equipa
  useEffect(() => {
    const fetchEquipa = async () => {
      try {
        const response = await fetch('http://localhost:8080/equipa'); 
        if (!response.ok) {
          throw new Error('Erro ao buscar a equipa');
        }
        const data = await response.json(); 
        setEquipa(data); 
      } catch (err) {
        setError(err.message);
      }
    };

    fetchEquipa(); 
  }, []);

  if (error) {
    return <p className="text-red-500">Erro: {error}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Equipa</h1>
      <h2 className="text-lg font-semibold mb-2">Investigadores</h2>
      <ul>
        {equipa
          .filter((member) => member.cargo === 'Investigador') 
          .map((member) => (
            <li key={member.id} className="mb-2">
              {member.nome}
            </li>
          ))}
      </ul>
      <h2 className="text-lg font-semibold mt-4 mb-2">Colaboradores</h2>
      <ul>
        {equipa
          .filter((member) => member.cargo === 'Colaborador') 
          .map((member) => (
            <li key={member.id} className="mb-2">
              {member.nome}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default EquipaTest;
