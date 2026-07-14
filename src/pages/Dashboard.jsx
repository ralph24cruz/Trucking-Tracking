import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { io } from 'socket.io-client';
import L from 'leaflet';

// Create a custom icon for trucks
const truckIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/709/709743.png',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

export default function Dashboard() {
  const [trucks, setTrucks] = useState({});

  useEffect(() => {
    // Connect to local Node simulator in dev, or same host in production
    const socketUrl = import.meta.env.PROD ? undefined : 'http://localhost:5123';
    const socket = io(socketUrl);

    socket.on('connect', () => {
      console.log('Connected to truck simulator');
    });

    socket.on('trucks_update', (data) => {
      setTrucks(data);
    });

    return () => socket.disconnect();
  }, []);

  const truckList = Object.values(trucks);

  return (
    <div className="flex flex-col h-full gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Live GPS Dashboard</h1>
        <p className="text-slate-500">Real-time tracking of your active fleet.</p>
      </div>

      <div className="flex gap-6 h-[calc(100%-80px)]">
        {/* Map View */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
          <MapContainer 
            center={[14.6095, 120.9942]} 
            zoom={13} 
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            
            {truckList.map(truck => (
              <Marker 
                key={truck.id} 
                position={[truck.lat, truck.lng]} 
                icon={truckIcon}
              >
                <Popup>
                  <div className="p-1">
                    <h3 className="font-bold text-slate-800">{truck.name}</h3>
                    <p className="text-sm text-slate-500 capitalize">Status: {truck.status}</p>
                    <p className="text-xs text-slate-400 mt-2">
                      Last Updated: {new Date(truck.timestamp || Date.now()).toLocaleTimeString()}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Sidebar Status */}
        <div className="w-80 bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col">
          <h2 className="font-semibold text-slate-800 mb-4">Active Vehicles ({truckList.length})</h2>
          <div className="space-y-3 overflow-y-auto flex-1 pr-2">
            {truckList.map(truck => (
              <div key={truck.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:border-blue-200 hover:bg-blue-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-slate-800">{truck.name}</h3>
                  <span className="px-2 py-1 rounded-md bg-green-100 text-green-700 text-xs font-medium capitalize">
                    {truck.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500 space-y-1">
                  <p>Lat: {truck.lat.toFixed(4)}</p>
                  <p>Lng: {truck.lng.toFixed(4)}</p>
                </div>
              </div>
            ))}
            {truckList.length === 0 && (
              <div className="text-center text-slate-500 py-8 text-sm">
                Waiting for simulator data...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
