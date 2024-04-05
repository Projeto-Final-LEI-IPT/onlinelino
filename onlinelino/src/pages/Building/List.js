import React from "react";
import NavbarHome from "../../components/NavbarHome";
import NavbarBuilding from "../../components/NavbarBuilding";
import Container from "react-bootstrap/esm/Container";
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
                    <p>Lista</p>
                        {data.map(building => (
                            <div key={building.id}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <img src={`../${building.images[0]}`} alt={building.title} style={{ maxWidth: '200px', marginRight: '10px', maxHeight: '150px' }} />
                                    <div>
                                        <h4>{building.title}</h4>
                                        <p>{building.info}</p>
                                    </div>
                                </div>
                                <br />
                            </div>
                        ))}
                </Container>
            </>
        );
    }
}

export default ListIndex;