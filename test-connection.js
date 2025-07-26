const fetch = require('node-fetch');

async function testConnection() {
  try {
    console.log('Testing connection to backend...');
    const response = await fetch('http://10.132.202.162:8080/user/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com', password: 'test123' }),
    });
    
    console.log('Response status:', response.status);
    const data = await response.text();
    console.log('Response data:', data);
  } catch (error) {
    console.error('Connection failed:', error.message);
  }
}

testConnection(); 