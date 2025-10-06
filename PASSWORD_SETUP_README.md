# 🔐 Passwort-Setup Flow

## Übersicht

Wenn sich ein User zum ersten Mal über einen Magic Link anmeldet, wird er aufgefordert, ein Passwort zu setzen. Dies ermöglicht ihm, sich in Zukunft auch ohne Magic Link anzumelden.

## Flow

```
1. User erhält Magic Link per E-Mail
   ↓
2. Klickt auf Link → /auth/callback
   ↓
3. System prüft: Hat User Passwort gesetzt?
   ├─ Nein → Weiterleitung zu /setup-password ✨
   └─ Ja → Weiterleitung zu /dashboard
   ↓
4. User setzt Passwort mit schöner Animation
   ↓
5. Weiterleitung zu /dashboard
```

## Features

### 🎨 Schöne UI mit Framer Motion
- **Eingangs-Animation**: Smooth fade-in und scale
- **Passwort-Stärke-Anzeige**: Live-Feedback mit farbigen Balken
- **Anforderungs-Check**: Visuelles Feedback für jede Anforderung
- **Success-Animation**: Großer Check-Circle mit Spring-Animation
- **Loading-Animation**: Rotierendes Icon während der Verarbeitung

### 🔒 Sicherheits-Features
- **Passwort-Stärke-Prüfung**: 5 Stufen (Sehr schwach bis Sehr stark)
- **Minimum-Anforderungen**:
  - ✅ Mindestens 8 Zeichen
  - ✅ Großbuchstabe (A-Z)
  - ✅ Kleinbuchstabe (a-z)
  - ✅ Zahl (0-9)
  - ✅ Sonderzeichen (!@#$...)
- **Passwort-Bestätigung**: Muss übereinstimmen
- **Show/Hide Toggle**: Benutzerfreundlichkeit

### ⚡ UX-Features
- **Live-Validation**: Instant Feedback beim Tippen
- **Color-Coded Feedback**: Rot → Gelb → Grün
- **Progress Bars**: 5 animierte Balken für Stärke
- **Requirement List**: Klare Checkliste
- **Info-Box**: Erklärt warum ein Passwort wichtig ist

## Technische Details

### Dateien
- `/app/setup-password/page.tsx` - Hauptseite mit UI
- `/app/auth/callback/page.tsx` - Modifiziert für Redirect-Logik

### User Metadata
Der Flow nutzt `user.user_metadata.password_set` um zu prüfen, ob ein Passwort gesetzt wurde:

```typescript
// Check in Auth Callback
const needsPasswordSetup = !sessionData.session.user.user_metadata?.password_set

// Set when password is created
await supabase.auth.updateUser({
  password: password,
  data: { password_set: true }
})
```

### Animationen
Verwendet **Framer Motion** für flüssige Animationen:
- `AnimatePresence` für Ein-/Ausblenden
- `motion.div` für alle animierten Elemente
- Spring-Transitions für natürliche Bewegungen
- Stagger-Delays für sequentielle Animationen

## Testing

### Neuen User testen
1. Erstelle einen neuen User mit Magic Link
2. Klicke auf den Link in der E-Mail
3. Du wirst zu `/setup-password` weitergeleitet
4. Setze ein Passwort (mindestens Stärke "Gut")
5. Du wirst zu `/dashboard` weitergeleitet

### Bestehenden User testen
1. Logge dich mit einem User ein, der bereits ein Passwort hat
2. Du wirst direkt zu `/dashboard` weitergeleitet (kein Passwort-Setup)

## Anpassungen

### Passwort-Anforderungen ändern
Bearbeite die `calculatePasswordStrength` Funktion in `/app/setup-password/page.tsx`:

```typescript
const requirements = {
  length: pwd.length >= 8,      // Mindestlänge
  uppercase: /[A-Z]/.test(pwd),  // Großbuchstaben
  lowercase: /[a-z]/.test(pwd),  // Kleinbuchstaben
  number: /[0-9]/.test(pwd),     // Zahlen
  special: /[^A-Za-z0-9]/.test(pwd) // Sonderzeichen
}
```

### Redirect-Ziel ändern
Nach erfolgreichem Passwort-Setup:

```typescript
setTimeout(() => {
  router.push('/dashboard') // Ändere zu gewünschtem Ziel
}, 3000)
```

## Sicherheitshinweise

1. **HTTPS verwenden**: In Produktion immer HTTPS für Passwort-Übertragung
2. **Rate Limiting**: Implementiere Rate Limiting für Passwort-Updates
3. **Password Policy**: Passe die Anforderungen an deine Bedürfnisse an
4. **Session Management**: Sessions werden von Supabase verwaltet

## Zukunft

Mögliche Erweiterungen:
- [ ] Password-less Login Option (nur Magic Link)
- [ ] 2FA Support
- [ ] Passwort-Historie (verhindere Wiederverwendung)
- [ ] Passwort-Ablauf (z.B. alle 90 Tage)
- [ ] Passwort-Zurücksetzen Flow integrieren

