import React, { useState, useEffect, useRef } from "react";
import NavbarHome from "../../components/NavbarHome";
import NavbarBuilding from "../../components/NavbarBuilding";
import Container from "react-bootstrap/esm/Container";
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import data from '../../assets/data.json'; 

const libraries = ['places']; // Libraries needed for Google Maps

const MapIndex = () => {
    // Load the Google Maps API
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: 'AIzaSyBgydpzpaz7A19z5hPqOFAWkVl67lhTLls', // Replace with your Google Maps API key
        libraries,
    });

    // State variables to track map center, bounds, and selected building
    const [mapCenter, setMapCenter] = useState(null);
    const [mapBounds, setMapBounds] = useState(null);
    const [selectedBuilding, setSelectedBuilding] = useState(null);

    // Reference to the map container
    const mapContainerRef = useRef(null);

    // Effect to calculate map center and bounds when data and Google Maps API are loaded
    useEffect(() => {
        if (isLoaded && data.length > 0) {
            const latitudes = data.map(location => location.coordinates[0]);
            const longitudes = data.map(location => location.coordinates[1]);
            const minLat = Math.min(...latitudes);
            const maxLat = Math.max(...latitudes);
            const minLng = Math.min(...longitudes);
            const maxLng = Math.max(...longitudes);

            // Calculate the map center and bounds
            setMapCenter({ lat: (minLat + maxLat) / 2, lng: (minLng + maxLng) / 2 });
            setMapBounds({
                east: maxLng,
                north: maxLat,
                south: minLat,
                west: minLng
            });
        }
    }, [isLoaded]);

    // Effect to resize map container when window is resized
    useEffect(() => {
        const resizeMap = () => {
            if (mapContainerRef.current) {
                const containerWidth = mapContainerRef.current.clientWidth;
                mapContainerRef.current.style.height = `${containerWidth * 0.75}px`; // Adjust height aspect ratio as needed
            }
        };

        // Add event listener for window resize
        window.addEventListener('resize', resizeMap);
        resizeMap(); // Call once to set initial height

        // Remove event listener when component unmounts
        return () => {
            window.removeEventListener('resize', resizeMap);
        };
    }, []);

    // Handler for marker click event
    const handleMarkerClick = (building) => {
        setSelectedBuilding(building);
    };

    // Render loading/error message while Google Maps API is loading or if there's an error
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
            {/* Container for the map */}
            <Container ref={mapContainerRef} style={{ width: '100%', height: '50vh' }}>
                <p>Mapa</p>
                {/* GoogleMap component */}
                <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={mapCenter}
                    zoom={10}
                    onLoad={map => map.fitBounds(mapBounds)}
                >
                    {/* Render markers for each location */}
                    {data.map((location, index) => (
                        <Marker
                            key={index}
                            position={{ lat: location.coordinates[0], lng: location.coordinates[1] }}
                            title={location.title}
                            onClick={() => handleMarkerClick(location)}
                        />
                    ))}

                    {/* Render InfoWindow for selected building */}
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
