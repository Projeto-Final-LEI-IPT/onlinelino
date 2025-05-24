import React, { useState } from "react";
import NavbarBackoffice from "../../../components/NavbarBackoffice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../../style/Backoffice.css"; // assumindo que aqui tem as classes usadas

function TeamB() {
    const [collaboratorsText, setCollaboratorsText] = useState('');
    const [investigatorsText, setInvestigatorsText] = useState('');

    return (
        <div>
            <NavbarBackoffice />
            <div className="container">
                <h2 className="title">TeamB</h2>

                <div className="row">
                    {/* Colaboradores */}
                    <div className="column">
                        <h3>Colaboradores</h3>
                        <ReactQuill
                            value={collaboratorsText}
                            onChange={setCollaboratorsText}
                            theme="snow"
                            className="quillEditor"
                        />
                    </div>

                    {/* Investigadores */}
                    <div className="column">
                        <h3>Investigadores</h3>
                        <ReactQuill
                            value={investigatorsText}
                            onChange={setInvestigatorsText}
                            theme="snow"
                            className="quillEditor"
                        />
                    </div>
                </div>
                <div className="column">
                <button className="saveButton">Guardar</button>
                </div>
            </div>
        </div>
    );
}

export default TeamB;
