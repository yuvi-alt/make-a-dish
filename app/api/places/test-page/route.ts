import { NextResponse } from "next/server";

// Simple HTML test page
export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY;
  const apiKeyExists = !!apiKey;
  const apiKeyLength = apiKey ? apiKey.length : 0;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Google Places API Test</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .status {
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .success { background: #d4edda; color: #155724; }
    .error { background: #f8d7da; color: #721c24; }
    .info { background: #d1ecf1; color: #0c5460; }
    button {
      background: #007bff;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      margin: 5px;
    }
    button:hover { background: #0056b3; }
    pre {
      background: white;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
      border: 1px solid #ddd;
    }
    input {
      padding: 10px;
      width: 300px;
      border: 1px solid #ddd;
      border-radius: 5px;
      margin: 5px;
    }
  </style>
</head>
<body>
  <h1>🔍 Google Places API Test</h1>
  
  <div class="status ${apiKeyExists ? 'success' : 'error'}">
    <strong>API Key Status:</strong> ${apiKeyExists ? `✅ Configured (${apiKeyLength} characters)` : '❌ Not configured'}
  </div>

  <div class="status info">
    <strong>Test Instructions:</strong>
    <ul>
      <li>Try an address: "10 Downing Street, London"</li>
      <li>Try a postcode: "SW1A 1AA" or "M1 1AA"</li>
      <li>Try a partial address: "Buckingham Palace"</li>
    </ul>
  </div>

  <div>
    <h3>Quick Test:</h3>
    <input type="text" id="testQuery" placeholder="Enter address or postcode..." value="SW1A 1AA">
    <button onclick="testAPI()">Test API</button>
    <button onclick="testAutocomplete()">Test Autocomplete</button>
    <button onclick="testGeocode()">Test Geocode</button>
  </div>

  <div id="results"></div>

  <script>
    async function testAPI() {
      const query = document.getElementById('testQuery').value;
      const resultsDiv = document.getElementById('results');
      resultsDiv.innerHTML = '<p>Testing...</p>';
      
      try {
        const response = await fetch(\`/api/places/test?query=\${encodeURIComponent(query)}\`);
        const data = await response.json();
        resultsDiv.innerHTML = '<h3>Test Results:</h3><pre>' + JSON.stringify(data, null, 2) + '</pre>';
      } catch (error) {
        resultsDiv.innerHTML = '<div class="status error">Error: ' + error.message + '</div>';
      }
    }

    async function testAutocomplete() {
      const query = document.getElementById('testQuery').value;
      const resultsDiv = document.getElementById('results');
      resultsDiv.innerHTML = '<p>Testing Autocomplete...</p>';
      
      try {
        const response = await fetch(\`/api/places/autocomplete?input=\${encodeURIComponent(query)}\`);
        const data = await response.json();
        resultsDiv.innerHTML = '<h3>Autocomplete Results:</h3><pre>' + JSON.stringify(data, null, 2) + '</pre>';
      } catch (error) {
        resultsDiv.innerHTML = '<div class="status error">Error: ' + error.message + '</div>';
      }
    }

    async function testGeocode() {
      const query = document.getElementById('testQuery').value;
      const resultsDiv = document.getElementById('results');
      resultsDiv.innerHTML = '<p>Testing Geocode...</p>';
      
      try {
        const response = await fetch(\`/api/places/geocode?address=\${encodeURIComponent(query)}\`);
        const data = await response.json();
        resultsDiv.innerHTML = '<h3>Geocode Results:</h3><pre>' + JSON.stringify(data, null, 2) + '</pre>';
      } catch (error) {
        resultsDiv.innerHTML = '<div class="status error">Error: ' + error.message + '</div>';
      }
    }

    // Allow Enter key to trigger test
    document.getElementById('testQuery').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        testAutocomplete();
      }
    });
  </script>
</body>
</html>
  `;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}

