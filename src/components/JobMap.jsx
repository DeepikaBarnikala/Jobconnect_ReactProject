
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";

const locationCache = new Map();

async function getCoordinates(location) {
  const cacheKey = location.trim().toLowerCase();

  if (locationCache.has(cacheKey)) {
    return locationCache.get(cacheKey);
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=in&q=${encodeURIComponent(
        location + ", India"
      )}`
    );

    const data = await response.json();

    if (data.length > 0) {
      const coordinates = [
        Number(data[0].lat),
        Number(data[0].lon),
      ];

      locationCache.set(cacheKey, coordinates);
      return coordinates;
    }

    locationCache.set(cacheKey, null);
    return null;
  } catch (error) {
    console.error("Location lookup failed:", error);
    return null;
  }
}

function JobMap({ jobs, onLocationSelect }) {
  const [mappedLocations, setMappedLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadLocations() {
      setLoading(true);

      const groupedLocations = new Map();

      jobs.forEach((job) => {
        const location = String(job.location || "").trim();

        if (!location) return;

        const key = location.toLowerCase();

        if (!groupedLocations.has(key)) {
          groupedLocations.set(key, {
            location,
            jobs: [],
          });
        }

        groupedLocations.get(key).jobs.push(job);
      });

      const results = [];

      for (const item of groupedLocations.values()) {
        if (cancelled) return;

        const coordinates = await getCoordinates(item.location);

        if (coordinates) {
          results.push({
            ...item,
            coordinates,
          });
        }

        await new Promise((resolve) =>
          setTimeout(resolve, 1100)
        );
      }

      if (!cancelled) {
        setMappedLocations(results);
        setLoading(false);
      }
    }

    loadLocations();

    return () => {
      cancelled = true;
    };
  }, [jobs]);

  if (loading) {
    return (
      <div className="map-loading">
        Finding job locations on the map...
      </div>
    );
  }

  if (mappedLocations.length === 0) {
    return (
      <div className="map-empty-message">
        No mappable job locations found. Try another search or view the job list.
      </div>
    );
  }

  return (
    <div className="job-map-wrapper">
      <div className="map-heading">
        <div>
          <h3>Explore Jobs by Location</h3>

          <p>
            Click a city marker to view jobs available in that location.
            Locations are approximate city-level positions.
          </p>
        </div>

        <span className="map-location-count">
          {mappedLocations.length} locations
        </span>
      </div>

      <MapContainer
        center={[22.5, 79]}
        zoom={4.5}
        scrollWheelZoom={true}
        className="job-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {mappedLocations.map((item) => (
          <Marker
            key={item.location.toLowerCase()}
            position={item.coordinates}
          >
            <Popup>
              <div className="map-popup">
                <h4>{item.location}</h4>

                <p>
                  {item.jobs.length}{" "}
                  {item.jobs.length === 1 ? "job" : "jobs"} available
                </p>

                <button
                  type="button"
                  className="map-filter-btn"
                  onClick={() => onLocationSelect(item.location)}
                >
                  Show jobs in this location
                </button>

                <div className="map-popup-jobs">
                  {item.jobs.slice(0, 3).map((job) => (
                    <p key={job.id}>
                      <Link to={`/jobs/${job.id}`}>
                        {job.title}
                      </Link>
                    </p>
                  ))}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <p className="map-disclaimer">
        Map markers indicate approximate city locations, not exact company
        office addresses.
      </p>
    </div>
  );
}

export default JobMap;