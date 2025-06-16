import React, { useState, useEffect } from "react";
import NavbarBackoffice from "../../../components/NavbarBackoffice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../../style/Backoffice.css";
import { BACKOFFICE_URL, SERVER_URL, hasContentChanged } from "../../../Utils";

function BibliographyB() {
    const [bibliografia, setBibliografia] = useState({ texto_html: "", id: null });
    const [originalBibliografia, setOriginalBibliografia] = useState({ texto_html: "", id: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const SESSION_TOKEN = localStorage.getItem("authorization");

    useEffect(() => {
        const fetchBibliografia = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/bibliografia`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${SESSION_TOKEN}`,
                    },
                });

                if (!response.ok) throw new Error("Ocorreu um erro ou não possui autenticação necessária");
                const data = await response.json();

                if (data.length > 0) {
                    setBibliografia(data[0]);
                    setOriginalBibliografia(data[0]); 
                } else {
                    setBibliografia({ texto_html: "", id: null });
                    setOriginalBibliografia({ texto_html: "", id: null });
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBibliografia();
    }, [SESSION_TOKEN]);

    const isValidListHTML = (html) => {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const body = doc.body;

            if (body.children.length !== 1) return false;

            const list = body.children[0];
            if (!["UL", "OL"].includes(list.tagName)) return false;

            const onlyListItems = Array.from(list.children).every(child => child.tagName === "LI");
            return onlyListItems;
        } catch {
            return false;
        }
    };

    const handleSave = async () => {
        if (!bibliografia.id) {
            alert("ID da bibliografia não encontrado, impossível salvar.");
            return;
        }

        if (!isValidListHTML(bibliografia.texto_html)) {
            alert("O conteúdo deve ser uma lista HTML válida.");
            return;
        }

        if (!hasContentChanged(originalBibliografia, bibliografia)) {
            alert("Nenhuma alteração detetada. Nada foi salvo.");
            return;
        }

        try {
            const response = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/bibliografia/${bibliografia.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${SESSION_TOKEN}`,
                },
                body: JSON.stringify({ texto_html: bibliografia.texto_html }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Erro ao atualizar a bibliografia");
            }
            alert("Bibliografia atualizada com sucesso!");
            window.location.reload();
        } catch (err) {
            alert(`Erro: ${err.message}`);
        }
    };

    const handleChangeTexto = (value) => {
        setBibliografia((prev) => ({ ...prev, texto_html: value }));
    };

    if (loading) return <p>A carregar...</p>;
    if (error) return <p className="text-red-500">Erro: {error}</p>;

    return (
        <div>
            <NavbarBackoffice />
            <div className="container">
                <h2 className="title">Bibliografia</h2>
                <div className="bibliography-editor-wrapper">
                    <ReactQuill
                        value={bibliografia.texto_html}
                        onChange={handleChangeTexto}
                        theme="snow"
                        className="bibliography-editor"
                    />
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

export default BibliographyB;
