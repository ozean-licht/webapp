#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });

console.log('🔍 Environment Variables Debug\n');
console.log('='.repeat(60));

// N8N related
console.log('\n📡 N8N Variables:');
const n8nVars = Object.keys(process.env).filter(key => key.includes('N8N'));
n8nVars.forEach(key => {
  const value = process.env[key];
  console.log(`  ${key}: ${value ? value.substring(0, 20) + '...' : 'undefined'}`);
});

console.log('\n🔑 Specific Checks:');
console.log(`  N8N_API_KEY: ${process.env.N8N_API_KEY ? '✅ SET' : '❌ NOT SET'}`);
console.log(`  N8N_BASE_URL: ${process.env.N8N_BASE_URL ? '✅ SET' : '❌ NOT SET'}`);
console.log(`  N8N_URL: ${process.env.N8N_URL ? '✅ SET' : '❌ NOT SET'}`);
console.log(`  X-N8N-API-KEY: ${process.env['X-N8N-API-KEY'] ? '✅ SET' : '❌ NOT SET'}`);

console.log('\n💡 All available env keys:');
console.log(Object.keys(process.env).sort().join(', '));
