require('dotenv').config({ path: '.env.local' });
const axios = require('axios');
const fs = require('fs');
const path = require('path');

class N8NWorkflowManager {
  constructor() {
    this.n8nApiKey = process.env['N8N_API_KEY'] || process.env['X-N8N-API-KEY'];
    this.n8nUrl = process.env['N8N_URL'] || 'https://n8n.ozean-licht.com/api/v1';
    this.workflowsDir = path.join(__dirname, 'workflows', 'n8n');

    if (!this.n8nApiKey) {
      throw new Error('N8N_API_KEY oder X-N8N-API-KEY nicht in .env.local gefunden');
    }
  }

  async testConnection() {
    try {
      const response = await axios.get(`${this.n8nUrl}/workflows`, {
        headers: {
          'X-N8N-API-KEY': this.n8nApiKey,
          'Authorization': `Bearer ${this.n8nApiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      });
      console.log('✅ N8N Verbindung erfolgreich!');
      return true;
    } catch (error) {
      console.error('❌ Verbindungsfehler:', error.message);
      return false;
    }
  }

  async listLocalWorkflows() {
    const workflows = [];

    if (!fs.existsSync(this.workflowsDir)) {
      console.log('📁 Workflows-Verzeichnis nicht gefunden:', this.workflowsDir);
      return workflows;
    }

    const files = fs.readdirSync(this.workflowsDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    for (const file of jsonFiles) {
      try {
        const filePath = path.join(this.workflowsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const workflow = JSON.parse(content);

        workflows.push({
          file: file,
          path: filePath,
          data: workflow,
          name: workflow.name || file.replace('.json', ''),
          id: workflow.id
        });
      } catch (error) {
        console.error(`❌ Fehler beim Laden ${file}:`, error.message);
      }
    }

    return workflows;
  }

  async listRemoteWorkflows() {
    try {
      const response = await axios.get(`${this.n8nUrl}/workflows`, {
        headers: {
          'X-N8N-API-KEY': this.n8nApiKey,
          'Authorization': `Bearer ${this.n8nApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.data.map(workflow => ({
        id: workflow.id,
        name: workflow.name,
        active: workflow.active
      }));
    } catch (error) {
      console.error('❌ Fehler beim Laden der Remote-Workflows:', error.message);
      return [];
    }
  }

  async pushWorkflow(workflowData, workflowName) {
    try {
      console.log(`🚀 Pushe Workflow: ${workflowName}`);

      const response = await axios.post(`${this.n8nUrl}/workflows`, workflowData, {
        headers: {
          'X-N8N-API-KEY': this.n8nApiKey,
          'Authorization': `Bearer ${this.n8nApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(`✅ Workflow erfolgreich gepusht: ${response.data.name} (ID: ${response.data.id})`);
      return response.data;
    } catch (error) {
      console.error(`❌ Fehler beim Pushen von ${workflowName}:`, error.message);

      if (error.response) {
        console.error(`HTTP ${error.response.status}: ${error.response.statusText}`);
        if (error.response.data) {
          console.error('Details:', JSON.stringify(error.response.data, null, 2));
        }
      }

      throw error;
    }
  }

  async updateWorkflow(workflowId, workflowData, workflowName) {
    try {
      console.log(`🔄 Aktualisiere Workflow: ${workflowName} (ID: ${workflowId})`);

      const response = await axios.put(`${this.n8nUrl}/workflows/${workflowId}`, workflowData, {
        headers: {
          'X-N8N-API-KEY': this.n8nApiKey,
          'Authorization': `Bearer ${this.n8nApiKey}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(`✅ Workflow erfolgreich aktualisiert: ${response.data.name}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Fehler beim Aktualisieren von ${workflowName}:`, error.message);

      if (error.response) {
        console.error(`HTTP ${error.response.status}: ${error.response.statusText}`);
        if (error.response.data) {
          console.error('Details:', JSON.stringify(error.response.data, null, 2));
        }
      }

      throw error;
    }
  }

  async pushAllWorkflows() {
    console.log('🔍 Lade lokale Workflows...');
    const localWorkflows = await this.listLocalWorkflows();

    if (localWorkflows.length === 0) {
      console.log('⚠️  Keine lokalen Workflows gefunden');
      return;
    }

    console.log(`📋 Gefunden: ${localWorkflows.length} lokale Workflows`);
    localWorkflows.forEach(wf => console.log(`  - ${wf.name} (${wf.file})`));

    console.log('\n🔍 Lade Remote-Workflows...');
    const remoteWorkflows = await this.listRemoteWorkflows();
    const remoteWorkflowMap = new Map(remoteWorkflows.map(wf => [wf.name, wf]));

    console.log(`📊 Gefunden: ${remoteWorkflows.length} Remote-Workflows`);
    remoteWorkflows.forEach(wf => console.log(`  - ${wf.name} (ID: ${wf.id})`));

    console.log('\n🚀 Pushe/Aktualisiere Workflows...\n');

    for (const localWorkflow of localWorkflows) {
      try {
        const remoteWorkflow = remoteWorkflowMap.get(localWorkflow.name);

        if (remoteWorkflow) {
          // Workflow existiert bereits - aktualisieren
          await this.updateWorkflow(remoteWorkflow.id, localWorkflow.data, localWorkflow.name);
        } else {
          // Neuer Workflow - erstellen
          await this.pushWorkflow(localWorkflow.data, localWorkflow.name);
        }

        console.log(''); // Leerzeile für bessere Lesbarkeit
      } catch (error) {
        console.error(`Fehler bei Workflow ${localWorkflow.name}:`, error.message);
        console.log(''); // Leerzeile für bessere Lesbarkeit
      }
    }

    console.log('🎉 Alle Workflows wurden verarbeitet!');
  }

  async showHelp() {
    console.log(`
🌟 N8N Workflow Manager für Ozean-Licht

Verwendung:
  node push_n8n_workflow.js [command]

Commands:
  test       - Teste die N8N-Verbindung
  list       - Zeige lokale und Remote-Workflows
  push       - Pushe alle lokalen Workflows zu N8N
  help       - Zeige diese Hilfe

Workflows werden aus dem Verzeichnis ./workflows/n8n/ geladen.
Jede .json Datei sollte einen gültigen N8N Workflow enthalten.

Beispiel Workflow-Datei:
{
  "name": "Mein Workflow",
  "nodes": [...],
  "connections": {...},
  "active": false
}
    `);
  }

  async run(command = 'help') {
    switch (command.toLowerCase()) {
      case 'test':
        await this.testConnection();
        break;
      case 'list':
        console.log('📁 Lokale Workflows:');
        const localWorkflows = await this.listLocalWorkflows();
        localWorkflows.forEach(wf => console.log(`  - ${wf.name} (${wf.file})`));

        console.log('\n🌐 Remote Workflows:');
        const remoteWorkflows = await this.listRemoteWorkflows();
        remoteWorkflows.forEach(wf => console.log(`  - ${wf.name} (ID: ${wf.id})`));
        break;
      case 'push':
        if (await this.testConnection()) {
          await this.pushAllWorkflows();
        }
        break;
      case 'help':
      default:
        this.showHelp();
        break;
    }
  }
}

// Hauptfunktion
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';

  try {
    const manager = new N8NWorkflowManager();
    await manager.run(command);
  } catch (error) {
    console.error('💥 Fehler:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = N8NWorkflowManager;
