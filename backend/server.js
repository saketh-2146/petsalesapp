import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running.' });
});

// Example route for pets
app.get('/api/pets', (req, res) => {
  // Replace with actual database query
  res.json({
    pets: [
      { id: '1', name: 'Buddy', type: 'Dog' },
      { id: '2', name: 'Luna', type: 'Cat' }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
