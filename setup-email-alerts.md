# 🚨 N8N Email Alert Setup für Thumbnail Workflow

## 📧 SMTP-Konfiguration

### 1. Gmail SMTP (Empfohlen)
```
Host: smtp.gmail.com
Port: 587 (TLS) oder 465 (SSL)
Username: deine-email@gmail.com
Password: App-Password (nicht dein normales Passwort!)
```

**App-Password erstellen:**
- Google Account → Sicherheit → 2-Faktor-Authentifizierung
- App-Passwörter → Neue App erstellen
- "N8N Alerts" als Name verwenden

### 2. Outlook/Hotmail SMTP
```
Host: smtp-mail.outlook.com
Port: 587
Username: deine-email@outlook.com
Password: Dein Outlook-Passwort
```

### 3. Custom SMTP (z.B. für Ozean-Licht Domain)
```
Host: mail.ozean-licht.com
Port: 587 oder 465
Username: alerts@ozean-licht.com
Password: Dein SMTP-Password
```

## 🔧 N8N Email-Konfiguration

### 1. SMTP Credentials hinzufügen:
```
N8N Dashboard → Settings → Credentials → Add Credential
Type: Email SMTP Account
Name: Email SMTP (oder Ozean-Licht Alerts)
```

### 2. Credential-Details eingeben:
```
From Email: noreply@ozean-licht.com (oder deine Domain)
SMTP Host: [dein SMTP Host]
SMTP Port: [587 oder 465]
SSL/TLS: true
Username: [deine Email]
Password: [App-Password oder SMTP-Password]
```

### 3. Test-E-Mail senden:
- Credential speichern
- Workflow ausführen mit Test-Daten
- E-Mail sollte an sergej@ozean-licht.com gehen

## 🧪 Test-Workflow

### Manueller Test:
```bash
# Simuliere einen Webhook-Call mit Fehler
curl -X POST http://localhost:5678/webhook/airtable-thumbnail-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "baseId": "test",
    "tableId": "test",
    "recordId": "test",
    "changedFields": ["thumbnail"],
    "fields": {
      "slug": "test-error-course",
      "title": "Test Error Course",
      "thumbnail": [{"url": "https://invalid-url.com/image.png"}]
    }
  }'
```

### Erwartetes Ergebnis:
1. ✅ Workflow startet
2. ✅ Edge Function schlägt fehl (invalid URL)
3. ✅ Error Handler triggert
4. ✅ E-Mail wird an sergej@ozean-licht.com gesendet
5. ✅ 500 Response mit "Error processing thumbnail - alert sent"

## 📧 E-Mail Alert Inhalt

### Betreff:
```
🚨 ALERT: Thumbnail Processing Failed
```

### E-Mail Body:
```
Alert Details:

Workflow: Airtable Thumbnail Sync
Timestamp: 2025-01-19T10:30:00.000Z

Error Details:
Thumbnail processing failed: client error (Connect): dns error

Course: test-error-course
Base ID: test
Record ID: test

Please check the workflow logs immediately.

-- Ozean-Licht System Alert --
```

## 🔍 Monitoring & Debugging

### 1. Workflow Logs prüfen:
```
N8N Dashboard → Executions → Letzte Ausführung
```

### 2. E-Mail Logs prüfen:
- Gmail/Outlook → Gesendete E-Mails
- Spam-Ordner prüfen (manchmal landen Alerts dort)

### 3. Edge Function Logs:
```bash
# Supabase Dashboard → Edge Functions → process-course-thumbnail → Logs
```

## ⚙️ Troubleshooting

### Problem: E-Mail kommt nicht an
**Lösung:**
- SMTP-Credentials überprüfen
- App-Password neu generieren
- Firewall/SPAM-Filter prüfen

### Problem: Workflow startet nicht
**Lösung:**
- Webhook-URL überprüfen: `http://localhost:5678/webhook/airtable-thumbnail-webhook`
- N8N Logs prüfen
- Workflow aktivieren (grüner Play-Button)

### Problem: Falsche E-Mail-Adresse
**Lösung:**
- Send Failure Email Node bearbeiten
- To Email auf sergej@ozean-licht.com ändern

## 🎯 Produktions-Setup

### 1. Domain-E-Mail verwenden:
```
From: alerts@ozean-licht.com
SMTP: Dein Hosting-Provider SMTP
```

### 2. Mehrere Empfänger:
```
To: sergej@ozean-licht.com, admin@ozean-licht.com
```

### 3. Slack/Teams Integration (Optional):
- Zusätzlichen Webhook-Node für Slack/Teams hinzufügen
- Parallel zu E-Mail senden

## ✅ Erfolgreiche Einrichtung testen:

1. ✅ N8N läuft (`http://localhost:5678`)
2. ✅ Workflow importiert und aktiv
3. ✅ SMTP Credentials konfiguriert
4. ✅ Test-E-Mail manuell versendet
5. ✅ E-Mail bei sergej@ozean-licht.com angekommen
6. ✅ Alert bei Workflow-Fehler ausgelöst

**🎉 System ist bereit für Produktions-Einsatz mit vollständigem Monitoring!**
