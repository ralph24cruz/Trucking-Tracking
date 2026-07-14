import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// In production (Render), the port is provided by process.env.PORT
const PORT = process.env.PORT || 5123;

const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

// Mock initial positions (approximate Manila coordinates)
const trucks = {
  truck_1: { id: 'truck_1', name: 'Alpha Truck', lat: 14.5995, lng: 120.9842, status: 'driving' },
  truck_2: { id: 'truck_2', name: 'Beta Truck', lat: 14.6095, lng: 120.9942, status: 'driving' },
  truck_3: { id: 'truck_3', name: 'Gamma Truck', lat: 14.6195, lng: 121.0042, status: 'driving' },
};

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send initial data immediately
  socket.emit('trucks_update', trucks);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Update positions every 3 seconds
setInterval(() => {
  // Move trucks slightly
  Object.values(trucks).forEach(truck => {
    truck.lat += (Math.random() - 0.5) * 0.001; // small random move
    truck.lng += (Math.random() - 0.5) * 0.001;
    truck.timestamp = Date.now();
  });
  
  io.emit('trucks_update', trucks);
}, 3000);

// --- Serve React Frontend ---
// Serve static files from the React dist folder
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// For any unknown routes, send back index.html (React Router fallback)
app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

server.listen(PORT, () => {
  console.log(`Server and Simulator running on port ${PORT}`);
});
