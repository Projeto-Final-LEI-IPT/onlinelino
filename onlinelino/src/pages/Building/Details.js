import React, { useState } from 'react';
import NavbarHome from "../../components/NavbarHome";
import NavbarBuilding from '../../components/NavbarBuilding';
import Container from "react-bootstrap/esm/Container";
import { useParams } from 'react-router-dom';
import data from '../../assets/data.json';
import Modal from 'react-bootstrap/Modal';

const BuildingDetails = () => {
    const { id } = useParams();
    const building = data.find(building => building.id === parseInt(id));

    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageClick = (image) => {
        setSelectedImage(image);
        setShowModal(true);
    };

    if (!building) {
        return <div>Building not found</div>;
    }

    return (
        <>
            <NavbarHome />
            <br />
            <NavbarBuilding />
            <br />
            <Container>
                <h4>{building.title}</h4>
                <br/>
                <p>Ano do projecto: {building.year}</p>
                <p>Dono da Obra/Cliente: </p>
                <p>Tipologia: {building.typology}</p>
                <p>Localização: {building.location}</p>
                <br />
                {building.images.map((image, index) => (
                    <img 
                        key={index} 
                        src={`../${image}`} 
                        alt={`${building.title} - ${index + 1}`} 
                        style={{ 
                            maxWidth: '200px', 
                            maxHeight: '150px', 
                            transition: 'transform 0.3s ease',
                            cursor: 'pointer',
                            marginRight: '10px'
                        }} 
                        onClick={() => handleImageClick(image)}
                    />
                ))}
                <br />
                <br />
                <p>{building.info}</p>
            </Container>

            {/* Bootstrap modal to display the clicked image */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body style={{ textAlign: 'center' }}>
                    <img src={`../${selectedImage}`} alt={`${building.title}`} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                </Modal.Body>
            </Modal>
        </>
    );
}

export default BuildingDetails;
