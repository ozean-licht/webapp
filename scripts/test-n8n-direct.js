#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

const n8nApiKey = process.env.N8N_API_KEY;
const n8nBaseUrl = process.env.N8N_BASE_URL;

console.log('🔍 Direct N8N Test\n');
console.log(`URL: ${n8nBaseUrl}`);
console.log(`API Key: ${n8nApiKey ? n8nApiKey.substring(0, 20) + '...' : 'NOT SET'}`);

async function test() {
  // Test direkt mit IP
  const testUrls = [
    `${n8nBaseUrl}/api/v1/workflows`,
    'http://147.93.121.194:5678/api/v1/workflows',
    'https://n8n.ozean-licht.com/api/v1/workflows'
  ];
  
  for (const url of testUrls) {
    console.log(`\n🔗 Teste: ${url}`);
    
    try {
      const response = await axios.get(url, {
        headers: {
          'X-N8N-API-KEY': n8nApiKey
        },
        timeout: 5000
      });
      
      console.log(`✅ Erfolg! ${response.data.data?.length || 0} Workflows gefunden`);
      
      if (response.data.data) {
        response.data.data.slice(0, 3).forEach(w => {
          console.log(`  - ${w.name}`);
        });
      }
      
      return;
    } catch (error) {
      if (error.response) {
        console.log(`❌ HTTP ${error.response.status}: ${error.response.statusText}`);
      } else {
        console.log(`❌ ${error.message}`);
      }
    }
  }
}

test();
