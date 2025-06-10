import React from "react";
import NavbarBackoffice from "../../../components/NavbarBackoffice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../../style/Backoffice.css"; // Certifique-se que o CSS está importado

function IconicB() {
    return (
        <div>
            <NavbarBackoffice />
            <div className="container">
                <h2 className="title">Edificios Iconicos</h2>
                <div className="row">
                    {/* PORTUGUÊS */}
                    <div className="column">
                        <h3>Português</h3>
                        <ReactQuill
                            theme="snow"
                            className="quillEditor"
                        />
                    </div>

                    {/* INGLÊS */}
                    <div className="column">
                        <h3>Inglês</h3>
                        <ReactQuill
                            theme="snow"
                            className="quillEditor"
                        />
                    </div>
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

export default IconicB;
