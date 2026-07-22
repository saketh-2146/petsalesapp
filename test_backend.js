const API_URL = 'https://petconnect-wxdg.onrender.com/api';

async function testConnection() {
  console.log(`Testing connection to: ${API_URL}/pets`);
  try {
    const response = await fetch(`${API_URL}/pets`);
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success! Connected to Backend. Received data:', data);
    } else {
      console.log('Backend is reachable, but returned an error. This usually means the endpoint does not exist or requires authentication.');
    }
  } catch (error) {
    console.error('Error connecting to backend:', error.message);
  }
}

testConnection();
