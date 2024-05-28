import React, { useState, useEffect, useRef, useMemo } from 'react';
import NavbarHome from "../../components/NavbarHome";
import NavbarBuilding from '../../components/NavbarBuilding';
import Container from "react-bootstrap/esm/Container";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

function CronologyIndex() {
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedEvents, setSelectedEvents] = useState([]);
    const [markerPosition, setMarkerPosition] = useState(null);
    const timelineRef = useRef(null);

    const { t } = useTranslation();

    const data = useMemo(() => {
        const newData = [];
        for (let i = 0; i < 50; i++) {
            const title = t(`buildings.${i}.title`);
            const year = t(`buildings.${i}.year`);
            const images = t(`buildings.${i}.images.0`);

            if (!title.includes("title") && !year.includes("year") && !images.includes("images")) {
                newData.push({
                    id: i + 1,
                    title: title,
                    year: parseInt(year),
                    image: images
                });
            }
        }
        return newData;
    }, [t]);

    const handleEventClick = (year, events, xPos) => {
        setSelectedYear(selectedYear === year ? null : year);
        setSelectedEvents(events);
        setMarkerPosition(xPos);
    };

    useEffect(() => {
        const handleResize = () => {
            if (timelineRef.current) {
                const containerWidth = timelineRef.current.clientWidth;
                const maxYear = Math.max(...data.map(event => event.year));
                const minYear = Math.min(...data.map(event => event.year));
                const timelineWidth = (maxYear - minYear + 2) * 10; // Add buffer space
                timelineRef.current.style.width = `${timelineWidth > containerWidth ? timelineWidth : containerWidth}px`;
            }
        };

        // Initial resize on mount
        handleResize();

        // Event listener for window resize
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [data]); // Include `data` in the dependency array

    // Get unique years from data
    const years = [...new Set(data.map(event => event.year))];

    return (
        <>
            <NavbarHome />
            <br />
            <NavbarBuilding />
            <br />
            <Container>
                <div className="timeline" ref={timelineRef}>
                    <h2>{t('cronologyPage.title')}</h2>
                    <svg className="timeline-graphic" width="100%" height="60">
                        {/* Draw the x-axis */}
                        <line x1="0" y1="30" x2="100%" y2="30" style={{ stroke: 'black', strokeWidth: '2' }} />

                        {/* Draw dots for each unique year */}
                        {years.map(year => {
                            const eventsForYear = data.filter(event => event.year === year);
                            const xPos = ((year - Math.min(...years) + 1) * 100) / (Math.max(...years) - Math.min(...years) + 2);
                            return (
                                <g key={year}>
                                    <circle
                                        cx={`${xPos}%`}
                                        cy="30"
                                        r="5"
                                        className={`timeline-dot ${selectedYear === year ? 'selected' : ''}`}
                                        onClick={() => handleEventClick(year, eventsForYear, xPos)}
                                        style={{ cursor: 'pointer' }} // Change cursor to pointer when hovered over
                                    />
                                    <text
                                        x={`${xPos}%`}
                                        y="50"
                                        textAnchor="middle"
                                        fontSize="12"
                                    >
                                        {year}
                                    </text>
                                </g>
                            );
                        })}

                    </svg>
                    <br /><br /><br />

                    {/* Display event details for selected year */}
                    {selectedYear && (
                        <div className="event-details" style={{ position: 'relative' }}>
                            {/* Display marker */}
                            <div
                                style={{
                                    position: 'absolute',
                                    left: `${markerPosition}%`,
                                    top: '-10px', // Adjust as necessary
                                    transform: 'translateX(-50%)',
                                    background: 'white',
                                    border: '1px solid black',
                                    padding: '5px',
                                    borderRadius: '5px'
                                }}
                            >
                                {selectedEvents.map(event => (
                                    <div key={event.id}>
                                        <br />
                                        {event.image && ( // Check if event.image is defined
                                            <div>
                                            <Link to={`/obra/${event.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                <img className="rounded mx-auto d-block" src={event.image} alt="" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                                                <br />
                                                <p>{event.title}, {event.year}</p>
                                            </Link>
                                        </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Container>
        </>
    );
}

export default CronologyIndex;
