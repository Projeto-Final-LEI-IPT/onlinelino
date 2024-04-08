import React from "react";
import NavbarHome from "../../components/NavbarHome";
import NavbarBuilding from "../../components/NavbarBuilding";
import Container from "react-bootstrap/esm/Container";
import { Link } from "react-router-dom"; // Import Link from React Router
import data from '../../assets/data.json';

class ListIndex extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return (
            <>
                <NavbarHome />
                <br />
                <NavbarBuilding />
                <br />
                <Container>
                    <h4>Lista de Obras</h4>
                    {data.map(building => (
                        <div key={building.id}>
                            <Link key={building.id} to={`/obra/${building.id}`} style={{ textDecoration: 'none', color: 'inherit' }}> {/* Wrap each item with Link */}
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <img src={`../${building.images[0]}`} alt={building.title} style={{ maxWidth: '200px', marginRight: '10px', maxHeight: '150px' }} />
                                    <div>
                                        <h4>{building.title}</h4>
                                        <p>{building.info}</p>
                                    </div>
                                </div>
                            </Link>
                            <br />
                        </div>
                    ))}
                </Container>
            </>
        );
    }
}

export default ListIndex;
