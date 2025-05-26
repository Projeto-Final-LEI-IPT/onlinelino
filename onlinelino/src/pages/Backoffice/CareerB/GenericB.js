import React from "react";
import NavbarBackoffice from "../../../components/NavbarBackoffice";
import ReactQuill from "react-quill"; 
import "react-quill/dist/quill.snow.css";
import "../../../style/Backoffice.css"; // Certifique-se que seu CSS está sendo importado

function GenericB() {
    return (
        <div>
            <NavbarBackoffice />
            <div className="container">
                <h2 className="title">GenericB</h2>
                <div className="row">
                    {/* Caixa de texto e botão para PORTUGUÊS */}
                    <div className="column">
                        <ReactQuill
                            value="<p>Texto em português...</p>"
                            theme="snow"
                            className="quillEditor"
                        />
                        <button className="saveButton">Guardar</button>
                    </div>

                    {/* Caixa de texto e botão para INGLÊS */}
                    <div className="column">
                        <ReactQuill
                            value="<p>Text in English...</p>"
                            theme="snow"
                            className="quillEditor"
                        />
                        <button className="saveButton">Guardar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GenericB;
