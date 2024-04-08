import React from 'react';
import NavbarHome from "../../components/NavbarHome";
import NavbarBuilding from '../../components/NavbarBuilding';
import Container from "react-bootstrap/esm/Container";
import { useParams } from 'react-router-dom';
import data from '../../assets/data.json';

const BuildingDetails = () => {
    // Get the building ID from the URL params
    const { id } = useParams();

    // Find the building with the matching ID
    const building = data.find(building => building.id === parseInt(id));

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
                <div>
                    <h2>Detalhes da Obra</h2>
                    <h3>{building.title}</h3>
                    <p>Location: {building.location}</p>
                    <p>Year: {building.year}</p>
                    {/* Add more details as needed */}
                </div>
            </Container>
        </>

    );
}

export default BuildingDetails;
