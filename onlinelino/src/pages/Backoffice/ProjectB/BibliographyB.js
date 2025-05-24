import React from "react";
import NavbarBackoffice from "../../../components/NavbarBackoffice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../../style/Backoffice.css"; // Importe seu CSS principal

function BibliographyB() {
    return (
        <div>
            <NavbarBackoffice />
            <div className="container">
                <h2 className="title">BibliographyB</h2>
                <div className="bibliography-editor-wrapper">
                    <ReactQuill
                        theme="snow"
                        className="bibliography-editor"
                    />
                </div>
                <div className="column">
                <button className="saveButton">
                    Guardar
                </button>
                </div>
            </div>
        </div>
    );
}

export default BibliographyB;
