"use client";

import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Correção para ícones padrão do Leaflet no Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface FocoMapa {
  bioma: string;
  cidade: string;
  estado: string;
  frp: string;
  latitude: string;
  longitude: string;
  risc_fogo: string;
  satelite: string;
}

export default function MapView({ focos }: { focos: FocoMapa[] }) {
  // Centro aproximado do Brasil
  const center: [number, number] = [-14.235, -51.925];

  return (
    <div className="h-[400px] w-full rounded-md overflow-hidden border">
      <MapContainer center={center} zoom={4} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {focos.map((foco, index) => {
          const lat = parseFloat(foco.latitude);
          const lng = parseFloat(foco.longitude);
          
          if (isNaN(lat) || isNaN(lng)) return null;

          // Cor baseada no risco de fogo (0 a 1)
          const risco = parseFloat(foco.risc_fogo);
          const color = risco > 0.7 ? "red" : risco > 0.4 ? "orange" : "yellow";

          return (
            <CircleMarker
              key={index}
              center={[lat, lng]}
              pathOptions={{ color, fillColor: color, fillOpacity: 0.7 }}
              radius={5}
            >
              <Popup>
                <div className="text-sm">
                  <p><strong>Cidade:</strong> {foco.cidade} - {foco.estado}</p>
                  <p><strong>Bioma:</strong> {foco.bioma}</p>
                  <p><strong>FRP:</strong> {foco.frp}</p>
                  <p><strong>Risco de Fogo:</strong> {foco.risc_fogo}</p>
                  <p><strong>Satélite:</strong> {foco.satelite}</p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}