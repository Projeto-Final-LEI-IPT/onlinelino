import React, { useState, useEffect, useRef } from "react";
import NavbarHome from "../../components/NavbarHome";
import NavbarBuilding from "../../components/NavbarBuilding";
import Container from "react-bootstrap/esm/Container";
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import data from '../../assets/data.json';

const libraries = ['places'];

const MapIndex = () => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: 'AIzaSyBgydpzpaz7A19z5hPqOFAWkVl67lhTLls', // Replace with your Google Maps API key
        libraries,
    });

    const [mapCenter, setMapCenter] = useState(null);
    const [mapBounds, setMapBounds] = useState(null);
    const [selectedBuilding, setSelectedBuilding] = useState(null);
    const mapContainerRef = useRef(null);

    useEffect(() => {
        if (isLoaded && data.length > 0) {
            const latitudes = data.map(location => location.coordinates[0]);
            const longitudes = data.map(location => location.coordinates[1]);
            const minLat = Math.min(...latitudes);
            const maxLat = Math.max(...latitudes);
            const minLng = Math.min(...longitudes);
            const maxLng = Math.max(...longitudes);

            setMapCenter({ lat: (minLat + maxLat) / 2, lng: (minLng + maxLng) / 2 });
            setMapBounds({
                east: maxLng,
                north: maxLat,
                south: minLat,
                west: minLng
            });
        }
    }, [isLoaded]);

    useEffect(() => {
        const resizeMap = () => {
            if (mapContainerRef.current) {
                const containerWidth = mapContainerRef.current.clientWidth;
                mapContainerRef.current.style.height = `${containerWidth * 0.75}px`; // Adjust height aspect ratio as needed
            }
        };

        window.addEventListener('resize', resizeMap);
        resizeMap(); // Call once to set initial height

        return () => {
            window.removeEventListener('resize', resizeMap);
        };
    }, []);

    const handleMarkerClick = (building) => {
        setSelectedBuilding(building);
    };

    if (loadError) {
        return <div>Error loading maps</div>;
    }

    if (!isLoaded || !mapCenter || !mapBounds) {
        return <div>Loading maps</div>;
    }

    return (
        <>
            <NavbarHome />
            <br />
            <NavbarBuilding />
            <br />
            <Container ref={mapContainerRef} style={{ width: '100%', height: '50vh' }}>
                <p>Mapa</p>
                <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={mapCenter}
                    zoom={10}
                    onLoad={map => map.fitBounds(mapBounds)}
                >
                    {data.map((location, index) => (
                        <Marker
                            key={index}
                            position={{ lat: location.coordinates[0], lng: location.coordinates[1] }}
                            title={location.title}
                            onClick={() => handleMarkerClick(location)}
                        />
                    ))}

                    {selectedBuilding && selectedBuilding.coordinates && (
                        <InfoWindow
                            position={{ lat: selectedBuilding.coordinates[0], lng: selectedBuilding.coordinates[1] }}
                            onCloseClick={() => setSelectedBuilding(null)}
                        >
                            <div>
                                <h3>{selectedBuilding.title}</h3>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </Container>
        </>
    );
};

export default MapIndex;
