import React, { useState, useEffect, useRef } from "react";
import NavbarBackoffice from "../../../components/NavbarBackoffice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../../style/Backoffice.css";
import { BACKOFFICE_URL, SERVER_URL, hasContentChanged } from "../../../Utils";  
import '../../../style/Loading.css';

const STRUCTURE_TEMPLATE = `
  <p><br></p>
  <h4>Filmes</h4>
  <ul>
    <li><a href=""><br></a></li>
  </ul>
  <h4>Outros links</h4>
  <ul>
    <li><a href=""><br></a></li>
  </ul>
`;

const isStructureValid = (html) => {
    try {
        const doc = new DOMParser().parseFromString(`<div>${html}</div>`, "text/html");
        const container = doc.body.firstChild;

        const children = Array.from(container.children);
        if (children.length !== 5) return false;

        const [p, h4Filmes, ulFilmes, h4Links, ulLinks] = children;

        return (
            p.tagName === "P" &&
            h4Filmes.tagName === "H4" && h4Filmes.textContent.trim().toLowerCase() === "filmes" &&
            ulFilmes.tagName === "UL" &&
            h4Links.tagName === "H4" && h4Links.textContent.trim().toLowerCase() === "outros links" &&
            ulLinks.tagName === "UL"
        );
    } catch {
        return false;
    }
};

function GenericB() {
    const [contentPT, setContentPT] = useState(STRUCTURE_TEMPLATE);
    const [contentEN, setContentEN] = useState(STRUCTURE_TEMPLATE);
    const [overviewId, setOverviewId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const SESSION_TOKEN = localStorage.getItem("authorization");

    // Guarda o conteúdo original para comparação
    const originalContentPT = useRef(STRUCTURE_TEMPLATE);
    const originalContentEN = useRef(STRUCTURE_TEMPLATE);

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/overview`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${SESSION_TOKEN}`,
                    },
                });
                if (!response.ok) throw new Error("Erro ao buscar dados");

                const data = await response.json();

                if (data.length > 0) {
                    const item = data[0];
                    const ptContent = item.descricao_pt || STRUCTURE_TEMPLATE;
                    const enContent = item.descricao_en || STRUCTURE_TEMPLATE;

                    setContentPT(ptContent);
                    setContentEN(enContent);
                    setOverviewId(item.id);

                    originalContentPT.current = ptContent;
                    originalContentEN.current = enContent;
                } else {
                    setContentPT(STRUCTURE_TEMPLATE);
                    setContentEN(STRUCTURE_TEMPLATE);
                    setOverviewId(null);

                    originalContentPT.current = STRUCTURE_TEMPLATE;
                    originalContentEN.current = STRUCTURE_TEMPLATE;
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOverview();
    }, [SESSION_TOKEN]);

    const handleSave = async () => {
        if (!overviewId) {
            alert("ID não encontrado, impossível salvar.");
            return;
        }

        if (!hasContentChanged(
            { descricao_pt: originalContentPT.current, descricao_en: originalContentEN.current },
            { descricao_pt: contentPT, descricao_en: contentEN }
        )) {
            alert("Nenhuma alteração detetada. Nada foi salvo.");
            return;
        }

        if (!isStructureValid(contentPT) || !isStructureValid(contentEN)) {
            alert("Estrutura inválida. Por favor, não altere a estrutura base do conteúdo.");
            return;
        }

        try {
            const response = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/overview/${overviewId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${SESSION_TOKEN}`,
                },
                body: JSON.stringify({
                    descricao_pt: contentPT,
                    descricao_en: contentEN
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erro ao atualizar overview");
            }

            alert("Conteúdo salvo com sucesso!");
            window.location.reload();
        } catch (err) {
            alert(`Erro ao salvar: ${err.message}`);
        }
    };
    if (error) return <p className="text-red-500">Erro: {error}</p>;

    return (
        <div>
            {loading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            )}
            <NavbarBackoffice />
            <div className="container">
                <h2 className="title">Visão Geral</h2>
                <div className="row">
                    <div className="column">
                        <h3>Português</h3>
                        <ReactQuill
                            theme="snow"
                            value={contentPT}
                            onChange={setContentPT}
                            className="quillEditor"
                        />
                    </div>
                    <div className="column">
                        <h3>Inglês</h3>
                        <ReactQuill
                            theme="snow"
                            value={contentEN}
                            onChange={setContentEN}
                            className="quillEditor"
                        />
                    </div>
                </div>
                <div className="column">
                    <button className="saveButton" onClick={handleSave}>
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GenericB;
