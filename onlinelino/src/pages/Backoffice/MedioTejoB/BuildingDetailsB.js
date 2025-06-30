import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavbarBackoffice from "../../../components/NavbarBackoffice";
import Container from 'react-bootstrap/Container';
import { SERVER_URL, BACKOFFICE_URL, removeHtmlTags } from '../../../Utils';
import ReactQuill from "react-quill";
import '../../../style/Loading.css';
import { useAuthModalGuard } from '../useAuthModalGuard';
import ModalMessage from '../../../components/ModalMessage';

const BuildingDetailsB = () => {
  const [sessionToken] = useState(localStorage.getItem("authorization"));
  const { id } = useParams();
  const [edificio, setEdificio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagens, setImagens] = useState([]);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [modal, setModal] = useState({
    open: false,
    title: "",
    message: "",
    type: "info",
    action: null,
  });

  const showModal = (title, message, type = "info", actionCallback = null) => {
    setModal({
      open: true,
      title,
      message,
      type,
      action: actionCallback
        ? { label: "Login", onClick: actionCallback }
        : null,
    });
  };

  const authChecked = useAuthModalGuard(showModal);

  const originalEdificio = useRef(null);
  const originalImagens = useRef(null);

  useEffect(() => {
    if (!authChecked) return;
    const fetchEdificio = async () => {
      setLoading(true);
      try {
        if (!sessionToken) {
          showModal(
            "Autenticação necessária",
            "Por favor, faça login para continuar.",
            "warning",
            () => window.location.assign("/backoffice/login")
          );
          return;
        }
        const response = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/edificio/${id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${sessionToken}`,
          },
        });
        if (response.status === 403) {
          showModal(
            "Sessão expirada",
            "Por favor, faça login novamente.",
            "warning",
            () => window.location.assign("/backoffice/login")
          );
          return;
        }
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || "Erro ao buscar detalhes.");
        }
        const data = await response.json();
        data.titulo = removeHtmlTags(data.titulo || "");
        data.data_projeto = removeHtmlTags(data.data_projeto || "");
        data.tipologia = removeHtmlTags(data.tipologia || "");
        data.localizacao = removeHtmlTags(data.localizacao || "");

        setEdificio(data);
        setImagens((data.imagens || []).map((img) => ({
          ...img,
          isLocal: false,
          descricao: img.legenda_pt || "",
          descricaoOriginal: img.legenda_pt || "",
          caminho: img.caminho || "",
        })));

        originalEdificio.current = JSON.parse(JSON.stringify(data));
        originalImagens.current = JSON.parse(JSON.stringify(data.imagens || []));
      } catch (err) {
        showModal("Erro", "Erro ao buscar dados.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchEdificio();
  }, [id, authChecked, sessionToken]);

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

  const handleExcluirImagem = async (index) => {
    const confirmed = await showConfirmModal(
      "Confirmação",
      "Tem certeza de que deseja excluir esta imagem?"
    );
    if (!confirmed) return;

    const imagem = imagens[index];
    if (imagem.isLocal) {
      URL.revokeObjectURL(imagem.caminho);
    }

    const novasImagens = imagens.filter((_, i) => i !== index);
    setImagens(novasImagens);
  };


  const isEdificioEqual = (obj1, obj2) => {
    if (!obj1 || !obj2) return false;
    const keysToCompare = [
      "titulo", "data_projeto", "tipologia", "localizacao",
      "descricao_pt", "descricao_en", "fontes_bibliografia",
      "latitude", "longitude"
    ];
    return keysToCompare.every(key => (obj1[key] || '') === (obj2[key] || ''));
  };

  const areImagesEqual = (imgs1, imgs2) => {
    if (imgs1.length !== imgs2.length) return false;

    for (let i = 0; i < imgs1.length; i++) {
      const a = imgs1[i];
      const b = imgs2[i];
      if (a.id !== b.id) return false;
      if ((a.descricao || '') !== (b.legenda_pt || '')) return false;
      if (!!a.file) return false;
    }

    return true;
  };

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

    imagens.forEach((img, idx) => {
      if (!img.descricao || img.descricao.trim().length === 0) {
        newErrors[`imagem_${idx}`] = "A descrição da imagem é obrigatória.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validarFormulario()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);
    const lat = parseFloat(edificio.latitude);
    const lng = parseFloat(edificio.longitude);

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
        formData.append("latitude", lat.toString());
        formData.append("longitude", lng.toString());

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
            Authorization: `Bearer ${sessionToken}`,
          },
          body: formData,
        });

        if (!response.ok) throw new Error("Erro ao atualizar edifício");

        showModal("Sucesso", "Edifício atualizado com sucesso.", "success");
        window.location.reload();
      } catch (err) {
        showModal("Erro", "Erro ao atualizar edifício.", "error");
      } finally {
        setSubmitting(false);
      }
    } else {
      showModal("Aviso", "Nenhuma alteração foi detectada.", "info");
      setSubmitting(false);
    }
  };

  const handleExcluirEdificio = async () => {
    const confirmed = await showConfirmModal(
      "Confirmação",
      `Tem certeza que deseja excluir o edifício "${removeHtmlTags(edificio.titulo)}"?`
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/edificio/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${sessionToken}`,
        },
      });

      if (!response.ok) throw new Error("Erro ao excluir edifício");

      showModal("Sucesso", "Edifício excluído com sucesso!", "success");
      navigate("/backoffice/MedioTejoB/Buildings");
    } catch (err) {
      showModal("Erro", "Erro ao excluir: " + err.message, "error");
    }
  };


  const showConfirmModal = (title, message) => {
    return new Promise((resolve) => {
      setModal({
        open: true,
        title,
        message,
        type: "confirm",
        action: null,
        onConfirm: () => {
          setModal(prev => ({ ...prev, open: false }));
          resolve(true);
        },
        onCancel: () => {
          setModal(prev => ({ ...prev, open: false }));
          resolve(false);
        }
      });
    });
  };


  return (
    <>
      <ModalMessage
        show={modal.open}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={() => setModal(prev => ({ ...prev, open: false }))}
        action={modal.action}
      />

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
      <NavbarBackoffice />
      <Container style={{ paddingTop: '2rem', maxWidth: '800px' }}>
        <h4 style={{ marginBottom: '1.5rem' }}>Editar Edifício</h4>

        {!loading && edificio && (
          <>
            <div style={{ marginBottom: '1rem' }}>
              <label><strong>Título:</strong></label>
              <input
                type="text"
                value={edificio.titulo || ''}
                onChange={e => setEdificio(prev => ({ ...prev, titulo: removeHtmlTags(e.target.value) }))}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
              />
              {errors.titulo && <div style={{ color: "red", fontSize: "0.875rem" }}>{errors.titulo}</div>}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label><strong>Data do Projeto:</strong></label>
              <input
                type="text"
                value={edificio.data_projeto || ''}
                onChange={e => setEdificio(prev => ({ ...prev, data_projeto: removeHtmlTags(e.target.value) }))}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
              />
              {errors.data_projeto && <div style={{ color: "red", fontSize: "0.875rem" }}>{errors.data_projeto}</div>}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label><strong>Tipologia:</strong></label>
              <input
                type="text"
                value={edificio.tipologia || ''}
                onChange={e => setEdificio(prev => ({ ...prev, tipologia: removeHtmlTags(e.target.value) }))}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
              />
              {errors.tipologia && <div style={{ color: "red", fontSize: "0.875rem" }}>{errors.tipologia}</div>}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label><strong>Localização:</strong></label>
              <input
                type="text"
                value={edificio.localizacao || ''}
                onChange={e => setEdificio(prev => ({ ...prev, localizacao: removeHtmlTags(e.target.value) }))}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
              />
              {errors.localizacao && <div style={{ color: "red", fontSize: "0.875rem" }}>{errors.localizacao}</div>}
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label><strong>Descrição (PT):</strong></label>
              <ReactQuill
                value={edificio.descricao_pt}
                onChange={val => setEdificio(prev => ({ ...prev, descricao_pt: val }))}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label><strong>Descrição (EN):</strong></label>
              <ReactQuill
                value={edificio.descricao_en}
                onChange={val => setEdificio(prev => ({ ...prev, descricao_en: val }))}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label><strong>Fontes / Bibliografia:</strong></label>
              <ReactQuill
                value={edificio.fontes_bibliografia}
                onChange={val => setEdificio(prev => ({ ...prev, fontes_bibliografia: val }))}
              />
            </div>

            <div style={{ marginBottom: '1rem', display: "flex", gap: "1rem" }}>
              <label style={{ flex: 1 }}>
                <strong>Latitude:</strong>
                <input
                  type="number"
                  step="0.0000001"
                  value={edificio.latitude || ''}
                  onChange={(e) => setEdificio(prev => ({ ...prev, latitude: e.target.value }))}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
                />
                {errors.latitude && <div style={{ color: "red", fontSize: "0.875rem" }}>{errors.latitude}</div>}
              </label>

              <label style={{ flex: 1 }}>
                <strong>Longitude:</strong>
                <input
                  type="number"
                  step="0.0000001"
                  value={edificio.longitude || ''}
                  onChange={(e) => setEdificio(prev => ({ ...prev, longitude: e.target.value }))}
                  style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
                />
                {errors.longitude && <div style={{ color: "red", fontSize: "0.875rem" }}>{errors.longitude}</div>}
              </label>
            </div>

            <hr />

            <h5 style={{ marginTop: '2rem' }}>Imagens</h5>
            {imagens.map((imagem, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "15px",
                  gap: "15px",
                }}
              >
                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "8px",
                    overflow: "hidden",
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
                  style={{ flex: 1, padding: "10px", border: "1px solid #ccc", borderRadius: "6px" }}
                />
                {errors[`imagem_${index}`] && (
                  <div style={{ color: "red", fontSize: "0.875rem" }}>
                    {errors[`imagem_${index}`]}
                  </div>
                )}

                <div style={{ position: "relative", flexShrink: 0 }}>
                  <label
                    htmlFor={`file-input-${index}`}
                    style={{
                      backgroundColor: "#ddd",
                      padding: "8px 12px",
                      borderRadius: "6px",
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
                    padding: "10px 14px",
                    border: "none",
                    borderRadius: "6px",
                  }}
                >
                  Excluir
                </button>
              </div>
            ))}

            <div style={{ marginTop: "20px", marginBottom: "2rem" }}>
              <label
                htmlFor="nova-imagem-upload"
                style={{
                  backgroundColor: "#007bff",
                  color: "#fff",
                  padding: "10px 20px",
                  borderRadius: "6px",
                  cursor: "pointer",
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

            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                gap: "10px",
                marginTop: "2rem",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={handleSave}
                disabled={submitting}
                style={{
                  backgroundColor: "#114c44",
                  color: "#fff",
                  padding: "12px 20px",
                  borderRadius: "6px",
                  border: "none",
                  fontSize: "16px",
                  width: "150px",
                }}
              >
                {submitting ? "A guardar..." : "Guardar"}
              </button>

              <button
                onClick={handleExcluirEdificio}
                style={{
                  backgroundColor: "#b22222",
                  color: "#fff",
                  padding: "12px 20px",
                  borderRadius: "6px",
                  border: "none",
                  fontSize: "16px",
                  width: "150px",
                }}
              >
                Excluir Edifício
              </button>
            </div>
          </>
        )}
      </Container>
    </>
  );
};

export default BuildingDetailsB;
