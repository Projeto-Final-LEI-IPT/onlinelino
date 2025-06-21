import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavbarBackoffice from "../../../components/NavbarBackoffice";
import Container from 'react-bootstrap/Container';
import { SERVER_URL, BACKOFFICE_URL, removeHtmlTags } from '../../../Utils';
import ReactQuill from "react-quill";

const BuildingDetailsB = () => {
  const { id } = useParams();
  const [edificio, setedificio] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [imagens, setImagens] = useState([]);
  const SESSION_TOKEN = localStorage.getItem("authorization");
  const navigate = useNavigate();


  // Guarda o estado original para comparação
  const originalEdificio = useRef(null);
  const originalImagens = useRef(null);

  useEffect(() => {
    const fetchEdificio = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/edificio/${id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${SESSION_TOKEN}`,
          },
        });
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error);
        }
        const data = await response.json();
        setedificio(data);
        setImagens((data.imagens || []).map((img) => ({
          ...img,
          isLocal: false,
          descricao: img.legenda_pt || "",
          descricaoOriginal: img.legenda_pt || "",
          caminho: img.caminho || "", 
        })));

        // Guardar estado original (deep copy)
        originalEdificio.current = JSON.parse(JSON.stringify(data));
        originalImagens.current = JSON.parse(JSON.stringify(data.imagens || []));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEdificio();
  }, [id, SESSION_TOKEN]);

  const handleUploadImagem = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setImagens((prev) => [
        ...prev,
        { file, caminho: preview, descricao: "", isLocal: true }
      ]);
    }
  };

  const handleDescricaoImagem = (index, novaDescricao) => {
    const novasImagens = [...imagens];
    novasImagens[index].descricao = novaDescricao;
    setImagens(novasImagens);
  };

  const handleTrocarArquivoImagem = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    const novasImagens = [...imagens];
    novasImagens[index] = {
      ...novasImagens[index],
      file,
      caminho: preview,
      isLocal: false
    };
    setImagens(novasImagens);
  };

  const handleExcluirImagem = (index) => {
    const confirmacao = window.confirm("Tem certeza de que deseja excluir esta imagem?");
    if (!confirmacao) return;

    const imagem = imagens[index];

    if (imagem.isLocal) {
      URL.revokeObjectURL(imagem.caminho);
    }

    const novasImagens = imagens.filter((_, i) => i !== index);
    setImagens(novasImagens);
  };

  // Função para comparar objetos simples (edificio)
  const isEdificioEqual = (obj1, obj2) => {
    if (!obj1 || !obj2) return false;
    const keysToCompare = [
      "titulo", "data_projeto", "tipologia", "localizacao",
      "descricao_pt", "descricao_en", "fontes_bibliografia",
      "latitude", "longitude"
    ];
    return keysToCompare.every(key => (obj1[key] || '') === (obj2[key] || ''));
  };

  // Função para comparar imagens (descrição e presença de arquivos novos)
  const areImagesEqual = (imgs1, imgs2) => {
    if (imgs1.length !== imgs2.length) return false;

    for (let i = 0; i < imgs1.length; i++) {
      const a = imgs1[i];
      const b = imgs2[i];

      // comparar id
      if (a.id !== b.id) return false;

      // comparar legenda/descrição
      if ((a.descricao || '') !== (b.legenda_pt || '')) return false;

      // comparar se tem arquivo novo
      if (!!a.file) return false; // se há arquivo novo, mudou
    }

    return true;
  };

  const handleSave = async () => {
    if (!isEdificioEqual(edificio, originalEdificio.current) || !areImagesEqual(imagens, originalImagens.current)) {
      try {
        const formData = new FormData();
        formData.append("titulo", edificio.titulo);
        formData.append("data_projeto", edificio.data_projeto);
        formData.append("tipologia", edificio.tipologia);
        formData.append("localizacao", edificio.localizacao);
        formData.append("descricao_pt", edificio.descricao_pt);
        formData.append("descricao_en", edificio.descricao_en || "");
        formData.append("fontes_bibliografia", edificio.fontes_bibliografia || "");
        formData.append("latitude", edificio.latitude || "");
        formData.append("longitude", edificio.longitude || "");

        const fotosMeta = imagens.map((img) => ({
          id: img.id,
          legenda_pt: img.descricao,
          caminho_cronologia: img.caminho_cronologia || null,
          hasNewFile: !!img.file,
        }));

        formData.append("fotos_meta", JSON.stringify(fotosMeta));

        imagens.forEach((img) => {
          if (img.file) formData.append("fotos", img.file);
        });

        const response = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/edificio/${id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${SESSION_TOKEN}`,
          },
          body: formData,
        });

        if (!response.ok) throw new Error("Erro ao atualizar edifício");

        alert("Edifício atualizado com sucesso!");
        window.location.reload();
      } catch (err) {
        alert("Erro: " + err.message);
      }
    } else {
      alert("Nenhuma alteração foi detetada.");
    }
  };

  const handleExcluirEdificio = async () => {
  const confirmacao = window.confirm(`Tem certeza que deseja excluir o edifício "${removeHtmlTags(edificio.titulo)}"?`);
  if (!confirmacao) return;

  try {
    const response = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/edificio/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${SESSION_TOKEN}`,
      },
    });

    if (!response.ok) throw new Error("Erro ao excluir edifício");

    alert("Edifício excluído com sucesso!");
    navigate("/backoffice/edificios");
  } catch (err) {
    alert("Erro ao excluir: " + err.message);
  }
};


  if (loading) return <p>A carregar...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <>
      <NavbarBackoffice />
      <Container style={{ paddingTop: '2rem' }}>
        <p><strong>Título:</strong> <ReactQuill value={edificio?.titulo} onChange={val => setedificio(prev => ({ ...prev, titulo: val }))} /></p>
        <p><strong>Data do Projeto:</strong> <ReactQuill value={edificio?.data_projeto} onChange={val => setedificio(prev => ({ ...prev, data_projeto: val }))} /></p>
        <p><strong>Tipologia:</strong> <ReactQuill value={edificio?.tipologia} onChange={val => setedificio(prev => ({ ...prev, tipologia: val }))} /></p>
        <p><strong>Localização:</strong> <ReactQuill value={edificio?.localizacao} onChange={val => setedificio(prev => ({ ...prev, localizacao: val }))} /></p>
        <p><strong>Descrição (PT):</strong> <ReactQuill value={edificio?.descricao_pt} onChange={val => setedificio(prev => ({ ...prev, descricao_pt: val }))} /></p>
        <p><strong>Descrição (EN):</strong> <ReactQuill value={edificio?.descricao_en} onChange={val => setedificio(prev => ({ ...prev, descricao_en: val }))} /></p>
        <p><strong>Fontes / Bibliografia:</strong> <ReactQuill value={edificio?.fontes_bibliografia} onChange={val => setedificio(prev => ({ ...prev, fontes_bibliografia: val }))} /></p>

        <label><strong>Latitude:</strong>
          <input
            type="number"
            step="0.0000001"
            value={edificio?.latitude || ''}
            onChange={(e) => setedificio(prev => ({ ...prev, latitude: e.target.value }))}
          />
        </label>
        <br />
        <label><strong>Longitude:</strong>
          <input
            type="number"
            step="0.0000001"
            value={edificio?.longitude || ''}
            onChange={(e) => setedificio(prev => ({ ...prev, longitude: e.target.value }))}
          />
        </label>

        <hr />

        <h5>Imagens</h5>
        {imagens.map((imagem, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "10px", gap: "10px" }}>
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "8px",
                overflow: "hidden",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f0f0f0",
              }}
            >
              <img
                src={imagem.caminho}
                alt={`Preview ${index}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <input
              type="text"
              value={imagem.descricao}
              onChange={(e) => handleDescricaoImagem(index, e.target.value)}
              placeholder="Descrição"
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />

            <div style={{ position: "relative", flexShrink: 0 }}>
              <label
                htmlFor={`file-input-${index}`}
                style={{
                  display: "inline-block",
                  backgroundColor: "#ddd",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Atualizar imagem
              </label>
              <input
                id={`file-input-${index}`}
                type="file"
                accept="image/*"
                onChange={(e) => handleTrocarArquivoImagem(index, e)}
                style={{ display: "none" }}
              />
            </div>

            <button
              onClick={() => handleExcluirImagem(index)}
              style={{
                backgroundColor: "#b22222",
                color: "#fff",
                border: "none",
                padding: "8px 12px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Excluir
            </button>
          </div>
        ))}
        <div style={{ marginTop: "20px" }}>
          <label
            htmlFor="nova-imagem-upload"
            style={{
              display: "inline-block",
              backgroundColor: "#007bff",
              color: "#fff",
              padding: "10px 16px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Adicionar nova imagem
          </label>
          <input
            id="nova-imagem-upload"
            type="file"
            accept="image/*"
            onChange={handleUploadImagem}
            style={{ display: "none" }}
          />
        </div>


        <div style={{
          display: 'flex',
          gap: '10px',
          marginTop: '2rem',
          justifyContent: 'flex-start',
          flexWrap: 'wrap'
        }}>
          <button
            className="bottomButton"
            onClick={handleSave}
            style={{
              backgroundColor: "#114c44",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
              width: "150px"
            }}
          >
            Guardar
          </button>

          <button
          className="bottomButton"
            onClick={handleExcluirEdificio}
            style={{
              backgroundColor: "#b22222",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
              width: "150px"
            }}
          >
            Excluir Edifício
          </button>
        </div>

      </Container>
    </>
  );
};

export default BuildingDetailsB;
