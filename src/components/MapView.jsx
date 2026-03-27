import { useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../db';
import useStore from '../store/useStore';
import { addLog } from '../utils/logger';
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

function createConvoyIcon() {
  return L.divIcon({
    className: 'convoy-marker',
    html: `
      <div style="
        width: 28px;
        height: 28px;
        background: #f97316;
        border-radius: 6px;
        border: 2px solid #fb923c;
        box-shadow: 0 0 16px #f9731688, 0 0 32px #f9731644;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        animation: convoy-pulse 1s ease-in-out infinite;
      ">🚛</div>
      <style>
        @keyframes convoy-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
      </style>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
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

function ConvoyLayer() {
  const map = useMap();
  const activeConvoys = useStore((s) => s.activeConvoys);
  const markersRef = useRef({});
  const intervalsRef = useRef({});

  const finishConvoy = useCallback(async (convoy) => {
    const marker = markersRef.current[convoy.id];
    if (marker) {
      map.removeLayer(marker);
      delete markersRef.current[convoy.id];
    }
    if (intervalsRef.current[convoy.id]) {
      clearInterval(intervalsRef.current[convoy.id]);
      delete intervalsRef.current[convoy.id];
    }

    const target = await db.camps.get(convoy.targetCampId);
    if (target) {
      const updateField = convoy.payloadType === 'ammo' ? 'ammoLevel' : 'suppliesLevel';
      const newValue = Math.min(100, (target[updateField] || 0) + 20);
      await db.camps.update(target.id, {
        [updateField]: newValue,
        lastUpdated: new Date().toISOString()
      });

      const newStatus = target.ammoLevel < 20 || target.suppliesLevel < 20 ? 'critical' : target.ammoLevel < 40 || target.suppliesLevel < 40 ? 'alert' : 'normal';
      await db.camps.update(target.id, { status: newStatus });

      await addLog(
        `CONVOY ARRIVED: ${target.name}`,
        'INFO',
        `${convoy.payloadType.toUpperCase()} +20% → ${newValue}%`
      );

      useStore.getState().addToast({
        type: 'success',
        title: '✅ CONVOY ARRIVED',
        message: `${convoy.payloadType.toUpperCase()} delivered to ${target.name}`
      });
    }

    await db.convoys.delete(convoy.id);
    useStore.getState().removeActiveConvoy(convoy.id);
  }, [map]);

  useEffect(() => {
    activeConvoys.forEach((convoy) => {
      if (!markersRef.current[convoy.id]) {
        const marker = L.marker([convoy.sourceLat, convoy.sourceLng], { icon: createConvoyIcon() }).addTo(map);
        markersRef.current[convoy.id] = marker;

        const duration = 12000;
        const steps = 120;
        const interval = duration / steps;
        let step = 0;

        intervalsRef.current[convoy.id] = setInterval(() => {
          step++;
          const progress = step / steps;
          const lat = convoy.sourceLat + (convoy.targetLat - convoy.sourceLat) * progress;
          const lng = convoy.sourceLng + (convoy.targetLng - convoy.sourceLng) * progress;
          marker.setLatLng([lat, lng]);
          useStore.getState().updateConvoyProgress(convoy.id, Math.round(progress * 100));

          if (step >= steps) {
            finishConvoy(convoy);
          }
        }, interval);
      }
    });

    return () => {
      Object.values(intervalsRef.current).forEach(clearInterval);
    };
  }, [activeConvoys, map, finishConvoy]);

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
        <ConvoyLayer />
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