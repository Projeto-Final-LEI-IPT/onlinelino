import React, { useEffect, useState } from "react";
import NavbarBackoffice from "../../../components/NavbarBackoffice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../../style/Backoffice.css";
import { BACKOFFICE_URL, SERVER_URL, hasContentChanged } from "../../../Utils";

function MaterialsB() {
  const [textoPT, setTextoPT] = useState("");
  const [textoEN, setTextoEN] = useState("");
  const [originalTextoPT, setOriginalTextoPT] = useState("");
  const [originalTextoEN, setOriginalTextoEN] = useState("");
  const [imagens, setImagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const SESSION_TOKEN = localStorage.getItem("authorization");

  useEffect(() => {
    const fetchConteudo = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/materiais`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${SESSION_TOKEN}`,
          },
        });

        if (!response.ok) throw new Error("Erro ao buscar os materiais.");

        const data = await response.json();
        if (data.length > 0) {
          setTextoPT(data[0].descricao_pt || "");
          setTextoEN(data[0].descricao_en || "");
          setOriginalTextoPT(data[0].descricao_pt || "");
          setOriginalTextoEN(data[0].descricao_en || "");
          setImagens(data[0].imagens || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConteudo();
  }, [SESSION_TOKEN]);

  const handleUploadImagem = (e) => {
  const file = e.target.files[0];
  if (file) {
    const path = `/img/${file.name}`; 
    setImagens((prev) => [...prev, { file, path, descricao: "" }]);
  }
};


  const handleDescricaoImagem = (index, novaDescricao) => {
    const novasImagens = [...imagens];
    novasImagens[index].descricao = novaDescricao;
    setImagens(novasImagens);
  };

  const handleExcluirImagem = (index) => {
    const novasImagens = imagens.filter((_, i) => i !== index);
    setImagens(novasImagens);
  };

  const handleSalvar = async () => {
    if (!hasContentChanged({ pt: originalTextoPT, en: originalTextoEN }, { pt: textoPT, en: textoEN })) {
      alert("Nenhuma alteração detetada.");
      return;
    }

    try {
      const response = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/materiais`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SESSION_TOKEN}`,
        },
        body: JSON.stringify({
          descricao_pt: textoPT,
          descricao_en: textoEN,
          imagens: imagens.map(({ path, descricao }) => ({ path, descricao })), 
        }),
      });

      if (!response.ok) throw new Error("Erro ao guardar os materiais.");

      alert("Materiais atualizados com sucesso!");
      window.location.reload();
    } catch (err) {
      alert(`Erro: ${err.message}`);
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p className="text-red-500">Erro: {error}</p>;

  return (
    <div>
      <NavbarBackoffice />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "40px" }}>Materiais</h2>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
          <div style={{ flex: 1 }}>
            <h3>Português</h3>
            <ReactQuill theme="snow" value={textoPT} onChange={setTextoPT} />
          </div>
          <div style={{ flex: 1 }}>
            <h3>Inglês</h3>
            <ReactQuill theme="snow" value={textoEN} onChange={setTextoEN} />
          </div>
        </div>

        {/* Upload de imagem */}
        <div style={{ marginTop: "40px" }}>
          <h3>Imagens</h3>
          <div style={{ marginTop: "20px" }}>
            {imagens.map((imagem, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                  gap: "10px",
                }}
              >
                <img
                  src={imagem.path}
                  alt={`Preview ${index}`}
                  style={{ width: "100px", height: "auto", borderRadius: "8px" }}
                />
                <input
                  type="text"
                  value={imagem.descricao}
                  onChange={(e) => handleDescricaoImagem(index, e.target.value)}
                  placeholder="Descrição"
                  style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                />
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
          </div>
        </div>
        <h4>Adicionar nova imagem</h4>
        <input type="file" onChange={handleUploadImagem} />

        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <button
            onClick={handleSalvar}
            style={{
              backgroundColor: "#114c44",
              color: "#fff",
              padding: "12px 30px",
              borderRadius: "6px",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default MaterialsB;
