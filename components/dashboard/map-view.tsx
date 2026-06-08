"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";
// @ts-ignore
import "leaflet/dist/leaflet.css";

// Corrigir ícones padrão do Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapViewProps {
  focos: any[];
}

export default function MapView({ focos }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Inicializa o mapa com zIndex mais baixo
    const map = L.map(mapContainerRef.current, {
      center: [-15.7801, -47.9292], // Centro do Brasil
      zoom: 4,
      zoomControl: true,
      attributionControl: true,
    });

    // Adiciona o tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    // Adiciona os marcadores se houver focos
    if (focos && focos.length > 0) {
      const bounds = L.latLngBounds([]);
      
      focos.forEach((foco) => {
        const lat = parseFloat(foco.latitude.trim());
        const lng = parseFloat(foco.longitude.trim());

        if (!isNaN(lat) && !isNaN(lng)) {
          // Determina a cor do marcador baseado no risco
          const risco = parseFloat(foco.risc_fogo);
          let markerColor = "#22c55e"; // verde (risco < 0.3)
          if (risco >= 0.8) {
            markerColor = "#a855f7"; // roxo
          } else if (risco >= 0.6) {
            markerColor = "#ef4444"; // vermelho
          } else if (risco >= 0.3) {
            markerColor = "#eab308"; // amarelo
          }
          // Cria um círculo no mapa
          const circle = L.circle([lat, lng], {
            radius: 15000,
            color: markerColor,
            fillColor: markerColor,
            fillOpacity: 0.3,
            weight: 2,
          }).addTo(map);

          // Adiciona popup com informações
          circle.bindPopup(`
            <div style="font-family: sans-serif;">
              <strong>${foco.cidade}, ${foco.estado}</strong><br/>
              <span>Bioma: ${foco.bioma}</span><br/>
              <span>FRP: ${foco.frp} MW</span><br/>
              <span>Risco: ${(risco * 100).toFixed(0)}%</span><br/>
              <span>Satélite: ${foco.satelite}</span>
            </div>
          `);

          bounds.extend([lat, lng]);
        }
      });

      // Ajusta o zoom para mostrar todos os focos
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }

    // Aplica z-index baixo ao container do mapa
    if (mapContainerRef.current) {
      mapContainerRef.current.style.zIndex = "0";
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [focos]);

  // Força o z-index do container do mapa
  return (
    <div 
      ref={mapContainerRef} 
      className="h-[400px] w-full rounded-md" 
      style={{ zIndex: 0 }}
    />
  );
}