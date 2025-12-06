import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents
} from "react-leaflet";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultMarkerIcon = new L.Icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [32, 48],
  iconAnchor: [16, 48],
});

// -------------------- Marker Animation ----------------------
const AnimatedMarker = ({ position }: { position: [number, number] }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, map.getZoom(), {
      duration: 0.7,
    });
  }, [position]);

  return <Marker position={position} icon={defaultMarkerIcon} />;
};

// -------------------- Click handler -------------------------
const ClickHandler = ({ onChange }: any) => {
  useMapEvents({
    click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      // Chỉ cho phép chọn vị trí trong Việt Nam
      if (lat < 8 || lat > 24 || lng < 102 || lng > 110) {
        alert("Chỉ được chọn vị trí trong Việt Nam");
        return;
      }

      onChange(lat, lng);
    },
  });
  return null;
};

// -------------------- Map Picker MAIN -----------------------
const MapPickerLeaflet = ({
  lat,
  lng,
  onChange,
}: {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}) => {
  const center: [number, number] = [lat, lng];

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // ---------------- Autocomplete SEARCH ---------------------
  const handleSearch = async (text: string) => {
    setSearch(text);

    if (text.length < 3) return;

    const url = `https://nominatim.openstreetmap.org/search?countrycodes=vn&q=${encodeURIComponent(
      text
    )}&format=json&limit=5`;

    const res = await fetch(url);
    const data = await res.json();

    setSuggestions(data);
  };

  const chooseLocation = (item: any) => {
    const newLat = Number(item.lat);
    const newLng = Number(item.lon);

    onChange(newLat, newLng);
    setSuggestions([]);
    setSearch(item.display_name);
  };

  return (
    <div style={{ width: "100%", position: "relative" }}>
      {/* SEARCH BAR */}
      <input
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Tìm địa điểm..."
        className="map-search-input"
        style={{
          width: "70%",
          padding: "10px 14px",
          borderRadius: "10px",
          border: "1px solid #d1d5db",
          position: "absolute",
          zIndex: 999,
          top: 10,
          left: 10,
          background: "white",
        }}
      />

      {/* SUGGEST LIST */}
      {suggestions.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: 54,
            left: 10,
            background: "white",
            zIndex: 999,
            width: "70%",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            maxHeight: "180px",
            overflowY: "auto",
          }}
        >
          {suggestions.map((item: any, idx: number) => (
            <div
              key={idx}
              onClick={() => chooseLocation(item)}
              style={{
                padding: "10px",
                cursor: "pointer",
                borderBottom: "1px solid #f3f4f6",
              }}
            >
              {item.display_name}
            </div>
          ))}
        </div>
      )}

      {/* MAP */}
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={true}
        style={{
          width: "100%",
          height: "420px",
          borderRadius: "24px",
          overflow: "hidden",
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <ClickHandler onChange={onChange} />

        {/* marker animation */}
        <AnimatedMarker position={center} />
      </MapContainer>
    </div>
  );
};

export default MapPickerLeaflet;
