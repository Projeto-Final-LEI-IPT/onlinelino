import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarBackoffice from "../../../components/NavbarBackoffice";
import Container from 'react-bootstrap/Container';
import { SERVER_URL, BACKOFFICE_URL } from '../../../Utils';
import ReactQuill from "react-quill";

const BuildingCreateB = () => {
  const [edificio, setEdificio] = useState({
    titulo: "",
    data_projeto: "",
    tipologia: "",
    localizacao: "",
    descricao_pt: "",
    descricao_en: "",
    fontes_bibliografia: "",
    latitude: "",
    longitude: ""
  });

  const [imagens, setImagens] = useState([]);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});


  const validarFormulario = () => {
  const newErrors = {};

  if (!edificio.titulo || edificio.titulo.trim().length < 3) {
    newErrors.titulo = "O título é obrigatório e deve ter pelo menos 3 caracteres.";
  }

  if (!edificio.data_projeto || !/^\d{4}(-\d{4})?$/.test(edificio.data_projeto.trim())) {
    newErrors.data_projeto = "Formato inválido. Use 'YYYY' ou 'YYYY-YYYY'.";
  }

  if (!edificio.tipologia || edificio.tipologia.trim().length < 3) {
    newErrors.tipologia = "Tipologia é obrigatória e deve ter pelo menos 3 caracteres.";
  }

  if (!edificio.localizacao || edificio.localizacao.trim().length < 3) {
    newErrors.localizacao = "Localização é obrigatória.";
  }

  const lat = parseFloat(edificio.latitude);
  const lng = parseFloat(edificio.longitude);

  if (isNaN(lat) || lat < -90 || lat > 90) {
    newErrors.latitude = "Latitude inválida. Deve estar entre -90 e 90.";
  }

  if (isNaN(lng) || lng < -180 || lng > 180) {
    newErrors.longitude = "Longitude inválida. Deve estar entre -180 e 180.";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


  const handleUploadImagem = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setImagens(prev => [...prev, { file, caminho: preview, descricao: "", isLocal: true }]);
    }
  };

  const handleDescricaoImagem = (index, novaDescricao) => {
    const novas = [...imagens];
    novas[index].descricao = novaDescricao;
    setImagens(novas);
  };

  const handleExcluirImagem = (index) => {
    const confirmacao = window.confirm("Tem certeza de que deseja excluir esta imagem?");
    if (!confirmacao) return;

    const novaLista = imagens.filter((_, i) => i !== index);
    setImagens(novaLista);
  };

  const handleSave = async () => {
    if (!validarFormulario()) return;
    const SESSION_TOKEN = localStorage.getItem("authorization");
    const lat = parseFloat(edificio.latitude);
    const lng = parseFloat(edificio.longitude);
    try {
      const formData = new FormData();
      Object.entries(edificio).forEach(([key, value]) => {
        if (key !== "latitude" && key !== "longitude") {
          formData.append(key, value);
        }
      });

      formData.append("latitude", lat.toString());
      formData.append("longitude", lng.toString());


      const fotosMeta = imagens.map(img => ({
        legenda_pt: img.descricao,
        legenda_en: "",
        caminho_cronologia: null,
        hasNewFile: !!img.file
      }));

      formData.append("fotos_meta", JSON.stringify(fotosMeta));

      imagens.forEach(img => {
        if (img.file) formData.append("fotos", img.file);
      });

      const response = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/edificio`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SESSION_TOKEN}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Erro ao criar edifício");

      const data = await response.json();
      alert("Edifício criado com sucesso!");
      navigate(`/backoffice/MedioTejoB/Buildings`);
    } catch (err) {
      alert("Erro: " + err.message);
    }
  };

  return (
    <>
      <NavbarBackoffice />
      <Container style={{ paddingTop: '2rem', maxWidth: '800px' }}>
        <h4 style={{ marginBottom: '1.5rem' }}>Adicionar Novo Edifício</h4>

        <div style={{ marginBottom: '1rem' }}>
          <label><strong>Título:</strong></label>
          <input
            type="text"
            value={edificio.titulo}
            onChange={e => setEdificio(prev => ({ ...prev, titulo: e.target.value }))}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
          {errors.titulo && <div style={{ color: "red", fontSize: "0.875rem" }}>{errors.titulo}</div>}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label><strong>Data do projeto:</strong></label>
          <input
            type="text"
            value={edificio.data_projeto}
            onChange={e => setEdificio(prev => ({ ...prev, data_projeto: e.target.value }))}
            placeholder="YYYY ou YYYY-YYYY"
            required
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
          {errors.data_projeto && <div style={{ color: "red", fontSize: "0.875rem" }}>{errors.data_projeto}</div>}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label><strong>Tipologia:</strong></label>
          <input
            type="text"
            value={edificio.tipologia}
            onChange={e => setEdificio(prev => ({ ...prev, tipologia: e.target.value }))}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
          {errors.tipologia && <div style={{ color: "red", fontSize: "0.875rem" }}>{errors.tipologia}</div>}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label><strong>Localização:</strong></label>
          <input
            type="text"
            value={edificio.localizacao}
            onChange={e => setEdificio(prev => ({ ...prev, localizacao: e.target.value }))}
            required
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          />
          {errors.localizacao && <div style={{ color: "red", fontSize: "0.875rem" }}>{errors.localizacao}</div>}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label><strong>Descrição (PT):</strong></label>
          <ReactQuill value={edificio.descricao_pt} onChange={val => setEdificio(prev => ({ ...prev, descricao_pt: val }))} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label><strong>Descrição (EN):</strong></label>
          <ReactQuill value={edificio.descricao_en} onChange={val => setEdificio(prev => ({ ...prev, descricao_en: val }))} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label><strong>Fontes / Bibliografia:</strong></label>
          <ReactQuill value={edificio.fontes_bibliografia} onChange={val => setEdificio(prev => ({ ...prev, fontes_bibliografia: val }))} />
        </div>

        <div style={{ marginBottom: '1rem', display: "flex", gap: "1rem" }}>
          <label style={{ flex: 1 }}>
            <strong>Latitude:</strong>
            <input
              type="number"
              step="0.0000001"
              value={edificio.latitude}
              onChange={e => setEdificio(prev => ({ ...prev, latitude: e.target.value }))}
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
            />
            {errors.latitude && <div style={{ color: "red", fontSize: "0.875rem" }}>{errors.latitude}</div>}
          </label>
          <label style={{ flex: 1 }}>
            <strong>Longitude:</strong>
            <input
              type="number"
              step="0.0000001"
              value={edificio.longitude}
              onChange={e => setEdificio(prev => ({ ...prev, longitude: e.target.value }))}
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
            />
            {errors.longitude && <div style={{ color: "red", fontSize: "0.875rem" }}>{errors.longitude}</div>}
          </label>
        </div>

        <hr />

        <h5 style={{ marginTop: '2rem' }}>Imagens</h5>
        {imagens.map((img, idx) => (
          <div key={idx} style={{ display: "flex", alignItems: "center", marginBottom: "15px", gap: "15px" }}>
            <div style={{ width: "100px", height: "100px", borderRadius: "8px", overflow: "hidden", backgroundColor: "#f0f0f0" }}>
              <img src={img.caminho} alt={`img-${idx}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>

            <input
              type="text"
              value={img.descricao}
              onChange={(e) => handleDescricaoImagem(idx, e.target.value)}
              placeholder="Descrição"
              style={{ flex: 1, padding: "10px", border: "1px solid #ccc", borderRadius: "6px" }}
            />

            <button
              onClick={() => handleExcluirImagem(idx)}
              style={{ backgroundColor: "#b22222", color: "#fff", padding: "10px 14px", border: "none", borderRadius: "6px" }}
            >
              Excluir
            </button>
          </div>
        ))}

        <div style={{ marginTop: "20px", marginBottom: "2rem" }}>
          <label htmlFor="nova-imagem-upload" style={{ backgroundColor: "#007bff", color: "#fff", padding: "10px 20px", borderRadius: "6px", cursor: "pointer" }}>
            Adicionar nova imagem
          </label>
          <input id="nova-imagem-upload" type="file" accept="image/*" onChange={handleUploadImagem} style={{ display: "none" }} />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-start", gap: "10px", marginTop: "2rem" }}>
          <button
            onClick={handleSave}
            style={{
              backgroundColor: "#114c44",
              color: "#fff",
              padding: "12px 20px",
              borderRadius: "6px",
              border: "none",
              fontSize: "16px",
              width: "150px"
            }}
          >
            Adicionar
          </button>
          <button
            onClick={() => navigate('/backoffice/MedioTejoB/Buildings')}
            style={{
              backgroundColor: "#b22222",
              color: "#fff",
              padding: "12px 20px",
              borderRadius: "6px",
              border: "none",
              fontSize: "16px",
              width: "150px"
            }}
          >
            Cancelar
          </button>
        </div>
      </Container>
    </>
  );
};

export default BuildingCreateB;
