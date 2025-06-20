import React, { useState, useEffect, useRef, useMemo } from "react";
import NavbarHome from "../../components/NavbarHome";
import Container from "react-bootstrap/esm/Container";
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const libraries = ['places']; // Libraries needed for Google Maps

const Map = () => {
    const { t } = useTranslation();
    const data = useMemo(() => {
        const newData = [];
        for (let i = 0; i < 50; i++) {
            if (t(`buildings.${i}.coordBool`)) {
                const title = t(`buildings.${i}.title`);
                const year = t(`buildings.${i}.year`);
                const latitudes = parseFloat(t(`buildings.${i}.coordinates.0`));
                const longitudes = parseFloat(t(`buildings.${i}.coordinates.1`));
                const images = t(`buildings.${i}.images.0`);

                if (!title.includes("title") && !year.includes("year") && !images.includes("images")) {
                    newData.push({
                        id: i + 1,
                        title: title,
                        year: parseInt(year),
                        latitudes: latitudes,
                        longitudes: longitudes,
                        image: images
                    });
                }
            }

        }
        return newData;
    }, [t]);

    // Load the Google Maps API
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: 'AIzaSyBsIx2lJVWnAwR087TB4Bs-l3xVRTGyqQY',
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
            const latitudes = data.map(location => location.latitudes);
            const longitudes = data.map(location => location.longitudes);
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
    }, [isLoaded, data]);

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
            {/* Container for the map */}
            <Container ref={mapContainerRef} style={{ width: '100%', height: '50vh' }}>
                {/* GoogleMap component */}
                <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={mapCenter}
                    zoom={10}
                    onLoad={map => map.fitBounds(mapBounds)}
                >
                    {/* Render markers for each location */}
                    {data.map((location) => (
                        <Marker
                            key={location.id} // Ensure unique key for each marker
                            position={{ lat: location.latitudes, lng: location.longitudes }}
                            title={location.title}
                            onClick={() => handleMarkerClick(location)}
                            icon={{
                                url: "../img/ponto.png", 
                                scaledSize: new window.google.maps.Size(50, 50) // Size of the marker
                              }}
                        />
                    ))}

                    {/* Render InfoWindow for selected building */}
                    {selectedBuilding && (
                        <InfoWindow
                            position={{ lat: selectedBuilding.latitudes, lng: selectedBuilding.longitudes }}
                            onCloseClick={() => setSelectedBuilding(null)}
                        >
                            <div>
                                <Link to={`/obra/${selectedBuilding.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <img className="rounded mx-auto d-block" src={selectedBuilding.image} alt="" style={{ maxWidth: '50px', maxHeight: '50px' }} />
                                    <br />
                                    <p>{selectedBuilding.title}, {selectedBuilding.year}</p>
                                </Link>
                            </div>
                        </InfoWindow>
                    )}
                </GoogleMap>
            </Container>
        </>
    );
};

export default Map;