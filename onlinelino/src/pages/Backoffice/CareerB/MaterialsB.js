import React, { useEffect, useState } from "react";
import NavbarBackoffice from "../../../components/NavbarBackoffice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../../style/Backoffice.css";
import { BACKOFFICE_URL, SERVER_URL, hasContentChanged } from "../../../Utils";
import '../../../style/Loading.css'

function MaterialsB() {
  const [textoPT, setTextoPT] = useState("");
  const [textoEN, setTextoEN] = useState("");
  const [originalTextoPT, setOriginalTextoPT] = useState("");
  const [originalTextoEN, setOriginalTextoEN] = useState("");
  const [imagens, setImagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const SESSION_TOKEN = localStorage.getItem("authorization");

  const isOnlyParagraphsValid = (html) => {
    try {
        const doc = new DOMParser().parseFromString(`<div>${html}</div>`, "text/html");
        const container = doc.body.firstChild;

        if (!container) return false;

        const children = Array.from(container.children);
        if (children.length === 0) return false;

        return children.every((child) => child.tagName === "P");
    } catch {
        return false;
    }
};

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
          setImagens(
            (data[0].imagens || []).map((img) => ({
              ...img,
              isLocal: false,
              descricaoOriginal: img.descricao || "",
            }))
          );

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
      const preview = URL.createObjectURL(file);
      setImagens((prev) => [
        ...prev,
        { file, path: preview, descricao: "", isLocal: true },
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
      path: preview,
      isLocal: false,
    };
    setImagens(novasImagens);
  };

  const handleExcluirImagem = async (index) => {
    const confirmacao = window.confirm(
      "Tem certeza de que deseja excluir esta imagem?"
    );
    if (!confirmacao) return;

    const imagem = imagens[index];

    try {
      if (!imagem.isLocal && imagem.id) {
        const response = await fetch(
          `${SERVER_URL}/${BACKOFFICE_URL}/materiais/imagem/${imagem.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${SESSION_TOKEN}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Erro ao excluir a imagem no servidor.");
        }
      } else if (imagem.isLocal) {
        // imagem local, libera URL
        URL.revokeObjectURL(imagem.path);
      }

      const novasImagens = imagens.filter((_, i) => i !== index);
      setImagens(novasImagens);
    } catch (err) {
      alert(`Erro ao excluir imagem: ${err.message}`);
    }
  };

  const handleSalvar = async () => {
    if (!isOnlyParagraphsValid(textoPT) || !isOnlyParagraphsValid(textoEN)) {
        alert("Apenas parágrafos são permitidos. Por favor, remova elementos como títulos, listas ou imagens.");
        return;
    }
    const houveAlteracoesTexto =
      hasContentChanged(
        { pt: originalTextoPT, en: originalTextoEN },
        { pt: textoPT, en: textoEN }
      );

    const houveImagensNovas = imagens.some((img) => img.isLocal && !img.id);
    const houveImagensAtualizadas = imagens.some(
      (img) =>
        (!img.isLocal && img.file) ||
        (!img.isLocal && img.descricao !== img.descricaoOriginal)
    );

    if (!houveAlteracoesTexto && !houveImagensNovas && !houveImagensAtualizadas) {
      alert("Nenhuma alteração detetada.");
      return;
    }

    const imagensNovas = imagens.filter((img) => img.isLocal && !img.id);

    const imagensSemDescricao = imagensNovas.filter((img) => !img.descricao || img.descricao.trim() === "");

    if (imagensSemDescricao.length > 0) {
      alert("Por favor, preencha a descrição de todas as novas imagens antes de guardar.");
      return;
    }

    try {

      if (houveAlteracoesTexto) {
        const responseTextos = await fetch(
          `${SERVER_URL}/${BACKOFFICE_URL}/materiais/1`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${SESSION_TOKEN}`,
            },
            body: JSON.stringify({
              descricao_pt: textoPT,
              descricao_en: textoEN,
            }),
          }
        );

        if (!responseTextos.ok) throw new Error("Erro ao atualizar textos");
      }


      const imagensNovas = imagens.filter((img) => img.isLocal && !img.id);
      const imagensUploadRes = [];

      for (const img of imagensNovas) {
        const formData = new FormData();
        formData.append("file", img.file);
        formData.append("descricao", img.descricao || "");
        formData.append("material_id", "1");

        const uploadRes = await fetch(
          `${SERVER_URL}/${BACKOFFICE_URL}/materiais/imagem`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${SESSION_TOKEN}`,
            },
            body: formData,
          }
        );

        if (!uploadRes.ok) throw new Error("Erro ao fazer upload da imagem");


        const uploadData = await uploadRes.json();
        imagensUploadRes.push({
          ...uploadData,
          isLocal: false,
          path: uploadData.path,
        });
      }


      const imagensExistentes = imagens.filter((img) => !img.isLocal || img.id);

      for (const img of imagensExistentes) {

        if (img.file || img.descricao !== undefined) {
          const formData = new FormData();
          if (img.file) {
            formData.append("file", img.file);
          }
          formData.append("descricao", img.descricao || "");

          const putRes = await fetch(
            `${SERVER_URL}/${BACKOFFICE_URL}/materiais/imagem/${img.id}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${SESSION_TOKEN}`,
              },
              body: formData,
            }
          );

          if (!putRes.ok) throw new Error("Erro ao atualizar imagem");
        }
      }


      setImagens([...imagensExistentes, ...imagensUploadRes]);
      setImagens((imgs) =>
        imgs.map((img) => ({
          ...img,
          descricaoOriginal: img.descricao,
        }))
      );


      alert("Materiais atualizados com sucesso!");

      setOriginalTextoPT(textoPT);
      setOriginalTextoEN(textoEN);
      window.location.reload();
    } catch (err) {
      alert(`Erro: ${err.message}`);
    }
  };

  useEffect(() => {
    return () => {
      imagens.forEach((img) => {
        if (img.isLocal) {
          URL.revokeObjectURL(img.path);
        }
      });
    };
  }, [imagens]);

  if (error) return <p className="text-red-500">Erro: {error}</p>;

  return (
    <div>
      {loading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            )}
      <NavbarBackoffice />
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "40px" }}>Materiais</h2>
        <div
          style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}
        >
          <div style={{ flex: 1 }}>
            <h3>Português</h3>
            <ReactQuill theme="snow" value={textoPT} onChange={setTextoPT} />
          </div>
          <div style={{ flex: 1 }}>
            <h3>Inglês</h3>
            <ReactQuill theme="snow" value={textoEN} onChange={setTextoEN} />
          </div>
        </div>

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
                    src={imagem.path}
                    alt={`Preview ${index}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
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
          </div>
        </div>

        <h4>Adicionar nova imagem</h4>
        <input type="file" accept="image/*" onChange={handleUploadImagem} />

        <div style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          zIndex: 10,
        }}>
          <button
            onClick={handleSalvar}
            style={{
              backgroundColor: "#114c44",
              color: "#fff",
              padding: "14px 24px",
              borderRadius: "50px",
              border: "none",
              fontSize: "16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
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
