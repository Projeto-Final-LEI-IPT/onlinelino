import React, { useState, useEffect } from "react";
import NavbarBackoffice from "../../../components/NavbarBackoffice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../../style/Backoffice.css";
import { BACKOFFICE_URL, SERVER_URL } from "../../../Utils";
import { HomePageDO } from "../../../server/Models/DataObjects"; 

function DescriptionB() {
    const [descricao, setDescricao] = useState(HomePageDO);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const SESSION_TOKEN = localStorage.getItem('authorization');


    useEffect(() => {
        const fetchDescricao = async () => {
            try {
                const response = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/descricao`, 
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${SESSION_TOKEN}`,
                    }

                });
                if (!response.ok) throw new Error("Ocorreu um erro ou não possui autenticação necessária");
                const data = await response.json();

                if (data.length > 0) {
                    setDescricao({ ...HomePageDO, ...data[0] });
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDescricao();
    }, []);

    const handleSave = async () => {
        const updatedDescricao = {
            ...descricao,
            modificado_em: new Date().toISOString(),
        };

        try {
            const response = await fetch(`${SERVER_URL}/${BACKOFFICE_URL}/descricao/${updatedDescricao.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${SESSION_TOKEN}`,
                },
                body: JSON.stringify(updatedDescricao),
            });

            if (!response.ok) throw new Error("Erro ao atualizar a descrição");
            alert("Descrição atualizada com sucesso!");
            window.location.reload();

        } catch (err) {
            alert(`Erro: ${err.message}`);
        }
    };

    const handleChangePt = (value) => {
        setDescricao((prev) => ({ ...prev, descricao_pt: value }));
    };

    const handleChangeEn = (value) => {
        setDescricao((prev) => ({ ...prev, descricao_en: value }));
    };

    if (loading) return <p>A carregar...</p>;
    if (error) return <p className="text-red-500">Erro: {error}</p>;

    return (
        <div>
            <NavbarBackoffice />
            <div className="container">
                <h2 className="title">Descrição</h2>
                <div className="row">
                    {/* PORTUGUÊS */}
                    <div className="column">
                        <h3>Português</h3>
                        <ReactQuill
                            value={descricao.descricao_pt}
                            onChange={handleChangePt}
                            theme="snow"
                            className="quillEditor"
                        />
                    </div>

                    {/* INGLÊS */}
                    <div className="column">
                        <h3>Inglês</h3>
                        <ReactQuill
                            value={descricao.descricao_en}
                            onChange={handleChangeEn}
                            theme="snow"
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

export default DescriptionB;
