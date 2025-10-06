require('dotenv').config({ path: '.env.local' });

const axios = require('axios');

async function testN8NConnection() {
  const n8nApiKey = process.env['N8N_API_KEY'] || process.env['X-N8N-API-KEY'];
  const n8nUrl = process.env['N8N_URL'] || process.env['N8N_BASE_URL'] || 'https://n8n.ozean-licht.com';

  if (!n8nApiKey) {
    console.error('❌ Fehler: N8N_API_KEY oder X-N8N-API-KEY nicht in .env.local gefunden');
    console.log('📝 Verfügbare ENV-Variablen:', Object.keys(process.env).filter(key => key.includes('N8N')));
    return;
  }
  
  // Normalisiere URL (entferne trailing slash und /api/v1 falls vorhanden)
  let baseUrl = n8nUrl.replace(/\/$/, '').replace(/\/api\/v1$/, '');
  
  console.log('🔗 Teste N8N Verbindung...');
  console.log(`🌐 Basis-URL: ${baseUrl}`);
  console.log(`🔑 API Key: ${n8nApiKey.substring(0, 10)}...`);

  // Verschiedene mögliche API-Endpunkte testen
  const endpoints = [
    '/api/v1/workflows',
    '/rest/workflows',
    '/workflows',
    '/api/workflows'
  ];

  for (const endpoint of endpoints) {
    const fullUrl = baseUrl + endpoint;
    console.log(`\n🔍 Teste Endpunkt: ${endpoint}`);

    try {
      const response = await axios.get(fullUrl, {
        headers: {
          'X-N8N-API-KEY': n8nApiKey,
          'Authorization': `Bearer ${n8nApiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      });

      console.log(`✅ Erfolgreich! Endpunkt gefunden: ${endpoint}`);
      console.log(`📊 Gefundene Workflows: ${response.data.data ? response.data.data.length : 'Unbekannt'}`);

      if (response.data.data && response.data.data.length > 0) {
        console.log('\n📋 Verfügbare Workflows:');
        response.data.data.slice(0, 5).forEach(workflow => {
          console.log(`- ${workflow.name} (ID: ${workflow.id})`);
        });
        if (response.data.data.length > 5) {
          console.log(`... und ${response.data.data.length - 5} weitere`);
        }
      }
      return;

    } catch (error) {
      if (error.response) {
        console.log(`❌ ${endpoint}: HTTP ${error.response.status} - ${error.response.statusText}`);
      } else {
        console.log(`❌ ${endpoint}: ${error.message}`);
      }
    }
  }

  console.log('\n❌ Kein funktionierender Endpunkt gefunden');
  console.log('💡 Mögliche Lösungen:');
  console.log('1. Prüfe die N8N-Dokumentation für den korrekten API-Endpunkt');
  console.log('2. Stelle sicher, dass die API in N8N aktiviert ist');
  console.log('3. Prüfe die N8N-Version - ältere Versionen haben andere Endpunkte');
  console.log('4. Teste manuell mit: curl -H "X-N8N-API-KEY: [dein-key]" https://n8n.ozean-licht.com/rest/workflows');
}

testN8NConnection();
