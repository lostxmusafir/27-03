import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../db';
import useStore from '../store/useStore';
import 'leaflet/dist/leaflet.css';

const statusColors = {
  normal: '#10b981',
  alert: '#eab308',
  critical: '#ef4444',
};

function createBlipIcon(status) {
  const color = statusColors[status] || statusColors.normal;
  return L.divIcon({
    className: 'custom-blip',
    html: `
      <div class="radar-blip" style="
        width: 16px;
        height: 16px;
        background: ${color};
        border-radius: 50%;
        border: 2px solid ${color}88;
        box-shadow: 0 0 12px ${color}88, 0 0 24px ${color}44;
        position: relative;
      "></div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

function MapClickHandler() {
  const { showAddCampForm, setMapClickCoords } = useStore();
  useMapEvents({
    click(e) {
      if (showAddCampForm) {
        setMapClickCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
  });
  return null;
}

function MapRefresher() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100);
  }, [map]);
  return null;
}

function SelectedCampFlyTo() {
  const selectedCamp = useStore((s) => s.selectedCamp);
  const map = useMap();
  useEffect(() => {
    if (selectedCamp) {
      map.flyTo([selectedCamp.lat, selectedCamp.lng], 8, { duration: 1.2 });
    }
  }, [selectedCamp, map]);
  return null;
}

export default function MapView() {
  const camps = useLiveQuery(() => db.camps.toArray());
  const borders = useLiveQuery(() => db.borders.toArray());
  const { setSelectedCamp } = useStore();

  return (
    <div className="flex-1 h-full relative">
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        className="h-full w-full"
        zoomControl={true}
        attributionControl={false}
      >
        <MapRefresher />
        <MapClickHandler />
        <SelectedCampFlyTo />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
        />

        {borders?.map((border) => (
          <Polyline
            key={border.id}
            positions={border.coordinates}
            pathOptions={{
              color: border.type === 'LoC' ? '#ef4444' : '#f97316',
              weight: 2,
              dashArray: '8, 8',
              opacity: 0.8,
            }}
          >
            <Popup>
              <div className="text-slate-900 font-semibold">{border.name}</div>
              <div className="text-xs text-slate-600">Type: {border.type}</div>
            </Popup>
          </Polyline>
        ))}

        {camps?.map((camp) => (
          <Marker
            key={camp.id}
            position={[camp.lat, camp.lng]}
            icon={createBlipIcon(camp.status)}
            eventHandlers={{
              click: () => setSelectedCamp(camp),
            }}
          >
            <Popup>
              <div className="text-slate-900">
                <div className="font-bold">{camp.name}</div>
                <div className="text-xs mt-1">Status: <span className="font-semibold">{camp.status.toUpperCase()}</span></div>
                <div className="text-xs">Troops: {camp.troopsCount}</div>
                <div className="text-xs">Ammo: {camp.ammoLevel}% | Supplies: {camp.suppliesLevel}%</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}