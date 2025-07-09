// src/components/MapComponent.js
import React, {useEffect} from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import CSS Leaflet
import L from 'leaflet'; // Import Leaflet library

// --- START PERBAIKAN DI SINI ---
// Fix default marker icon issue with Webpack/bundlers
// Menghapus fungsi _getIconUrl yang menyebabkan masalah dengan jalur default ikon.
delete L.Icon.Default.prototype._getIconUrl;

// Mengatur ulang opsi default untuk ikon marker Leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});
// --- END PERBAIKAN DI SINI ---

const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && map) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
};

const MapComponent = ({ location }) => {
  const initialPosition = [0, 0]; // Default position, will be updated by location prop
  const initialZoom = 2; // Initial zoom level

  return (
    <MapContainer
      center={location ? [location.lat, location.lon] : initialPosition}
      zoom={location ? 13 : initialZoom} // Zoom closer if location is available
      scrollWheelZoom={true}
      style={{ height: '100vh', width: '100%' }} // Make map fill the screen
    >
      <ChangeView center={location ? [location.lat, location.lon] : initialPosition} zoom={location ? 13 : initialZoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {location && (
        <Marker position={[location.lat, location.lon]}>
          <Popup>
            Latitude: {location.lat} <br /> Longitude: {location.lon} <br />
            Accuracy: {location.accuracy} meters
            {location.address && (
              <>
                <br /> Address: {location.address}
              </>
            )}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default MapComponent;
