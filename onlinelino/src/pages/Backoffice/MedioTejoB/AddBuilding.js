import React, { useState } from "react";
import NavbarBackoffice from "../../../components/NavbarBackoffice";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../../style/Backoffice.css"; 

function AddBuilding() {
  const [images, setImages] = useState([]);

  const handleImageUpload = (event) => {
    const files = event.target.files;
    if (files) {
      const imageURLs = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setImages(imageURLs);
    }
  };

  return (
    <div>
      <NavbarBackoffice />
      <div className="details-container">
        <h2 className="title">DetailsB</h2>

        {/* Título PT/EN */}
        <div className="section-row">
          <div className="field-column">
            <label htmlFor="titulo-pt">Título (PT)</label>
            <ReactQuill id="titulo-pt" className="quill-small" />
          </div>
          <div className="field-column">
            <label htmlFor="titulo-en">Título (EN)</label>
            <ReactQuill id="titulo-en" className="quill-small" />
          </div>
        </div>

        {/* Data Construção PT/EN */}
        <div className="section-row">
          <div className="field-column">
            <label htmlFor="data-pt">Data Construção (PT)</label>
            <ReactQuill id="data-pt" className="quill-small" />
          </div>
          <div className="field-column">
            <label htmlFor="data-en">Data Construção (EN)</label>
            <ReactQuill id="data-en" className="quill-small" />
          </div>
        </div>

        {/* Tipo PT/EN */}
        <div className="section-row">
          <div className="field-column">
            <label htmlFor="tipo-pt">Tipo (PT)</label>
            <ReactQuill id="tipo-pt" className="quill-small" />
          </div>
          <div className="field-column">
            <label htmlFor="tipo-en">Tipo (EN)</label>
            <ReactQuill id="tipo-en" className="quill-small" />
          </div>
        </div>

        {/* Latitude */}
        <div className="field-column">
          <label htmlFor="latitude">Latitude</label>
          <input id="latitude" type="text" className="input-style" />
        </div>

        {/* Longitude */}
        <div className="field-column">
          <label htmlFor="longitude">Longitude</label>
          <input id="longitude" type="text" className="input-style" />
        </div>

        {/* Descrição PT/EN */}
        <div className="section-row">
          <div className="field-column">
            <label htmlFor="descricao-pt">Descrição (PT)</label>
            <ReactQuill id="descricao-pt" className="quill-large" />
          </div>
          <div className="field-column">
            <label htmlFor="descricao-en">Descrição (EN)</label>
            <ReactQuill id="descricao-en" className="quill-large" />
          </div>
        </div>

        {/* Legenda PT/EN */}
        <div className="section-row">
          <div className="field-column">
            <label htmlFor="legenda-pt">Legenda da Imagem (PT)</label>
            <ReactQuill id="legenda-pt" className="quill-small" />
          </div>
          <div className="field-column">
            <label htmlFor="legenda-en">Legenda da Imagem (EN)</label>
            <ReactQuill id="legenda-en" className="quill-small" />
          </div>
        </div>

        {/* Upload de imagens */}
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            multiple
            className="upload-input"
          />
          {images.length > 0 && (
            <div className="preview-container">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Pré-visualização ${index + 1}`}
                  className="image-preview"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddBuilding;
