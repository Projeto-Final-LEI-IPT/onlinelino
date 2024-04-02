import React, { useState, useEffect, useRef } from 'react';
import data from '../assets/data.json';

function Timeline() {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const timelineRef = useRef(null);

  const handleEventClick = (year, events) => {
    setSelectedYear(selectedYear === year ? null : year);
    setSelectedEvents(events);
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
  }, []);

  // Get unique years from data
  const years = [...new Set(data.map(event => event.year))];

  return (
    <div className="timeline" ref={timelineRef}>
      <h2>Cronologia</h2>
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
                onClick={() => handleEventClick(year, eventsForYear)}
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
        <div className="event-details">
          <h4>Events for {selectedYear}</h4>
          {selectedEvents.map(event => (
            <div key={event.id}>
              <br />
              <h4>{event.title}</h4>
              <p>{event.info}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Timeline;
