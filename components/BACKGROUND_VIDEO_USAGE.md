# Background Video Komponente - Verwendung

## 🌊 Übersicht

Die `BackgroundVideo` Komponente ist eine optimierte, produktionsreife Lösung für das Ozean Licht Background-Video mit:
- ✅ Automatischer Mobile/Desktop-Erkennung
- ✅ Seamless Loop (20 Sekunden)
- ✅ Performance-Optimierung
- ✅ Smooth Loading mit Fade-In
- ✅ Responsive Video-Quellen
- ✅ Overlay für Text-Lesbarkeit

## 📦 Videos

**Desktop:**
https://api.ozean-licht.com/storage/v1/object/public/background_videos/ElectricWater_Dekstop.mp4

**Mobile:**
https://api.ozean-licht.com/storage/v1/object/public/background_videos/ElectricWater_Mobile.mp4

### Legacy Videos (archiviert):
- Base Desktop.mp4
- Base Mobile.mp4

## 🎯 Verwendungsbeispiele

### 1. Homepage (Standard)

```tsx
import { BackgroundVideo } from "@/components/background-video"

export default function Home() {
  return (
    <div className="min-h-screen">
      <BackgroundVideo 
        overlayOpacity={0.4}
        overlayColor="black"
      />
      
      <main className="relative z-10">
        {/* Dein Content */}
      </main>
    </div>
  )
}
```

### 2. Login/Register Seiten (Stärkerer Overlay)

```tsx
<BackgroundVideo 
  overlayOpacity={0.6}
  overlayColor="black"
/>
```

### 3. Dashboard (Subtiler Effekt)

```tsx
<BackgroundVideo 
  overlayOpacity={0.2}
  overlayColor="rgb(0, 0, 0)"
/>
```

### 4. Mit Poster-Image (Optional)

Für noch besseres Initial Loading kannst du ein Poster-Image hinzufügen:

```tsx
<BackgroundVideo 
  posterImage="/images/ocean-poster.webp"
  overlayOpacity={0.4}
  overlayColor="black"
/>
```

**Poster-Image erstellen:**
1. Nimm einen Screenshot vom ersten Frame des Videos
2. Exportiere als WebP mit 85% Qualität
3. Speichere in `/public/images/`

## ⚙️ Props

| Prop | Typ | Default | Beschreibung |
|------|-----|---------|--------------|
| `posterImage` | `string` | `undefined` | Fallback-Bild während des Video-Ladens |
| `className` | `string` | `''` | Zusätzliche CSS-Klassen |
| `overlayOpacity` | `number` | `0.3` | Overlay-Deckkraft (0-1) für Text-Lesbarkeit |
| `overlayColor` | `string` | `'black'` | Overlay-Farbe (CSS color) |

## 🎨 Styling-Tipps

### Text über Video gut lesbar machen

```tsx
{/* Option 1: Mit Background auf Text-Container */}
<div className="bg-black/50 backdrop-blur-sm p-8 rounded-lg">
  <h1 className="text-white">Dein Text</h1>
</div>

{/* Option 2: Mit Text-Shadow */}
<h1 className="text-white" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
  Dein Text
</h1>

{/* Option 3: Stärkerer Overlay */}
<BackgroundVideo overlayOpacity={0.6} />
```

### Verschiedene Bereiche unterschiedlich abdunkeln

```tsx
{/* Video als Background */}
<BackgroundVideo overlayOpacity={0.3} />

{/* Hero-Section zusätzlich abdunkeln */}
<section className="relative">
  <div className="absolute inset-0 bg-black/30" />
  <div className="relative z-10">
    {/* Content */}
  </div>
</section>
```

## 📊 Performance

### Dateigrößen
- **Desktop (1920x1080):** ~5-7 MB
- **Mobile (1280x720):** ~2-3 MB

### Ladezeit-Optimierung
1. Video lädt mit `preload="auto"`
2. Automatischer Fade-In wenn bereit
3. Optional: Poster-Image für sofortiges visuelles Feedback
4. Mobile-User bekommen kleinere Datei

### Browser-Support
- ✅ Chrome/Edge (alle Versionen)
- ✅ Safari (alle Versionen)
- ✅ Firefox (alle Versionen)
- ✅ Mobile Browser (iOS Safari, Chrome Mobile)

## 🚀 Wo verwenden?

### Empfohlen:
- ✅ Homepage (Hero-Section)
- ✅ Login/Register Seiten
- ✅ Dashboard
- ✅ About Lia Seite
- ✅ Mitgliedschaft Landing Page

### Nicht empfohlen:
- ❌ Course-Content Seiten (zu ablenkend)
- ❌ Text-lastige Seiten (Lesbarkeit)
- ❌ Admin-Bereiche

## 🔧 Troubleshooting

### Video spielt nicht automatisch
**Lösung:** Autoplay ist nur mit `muted` erlaubt (bereits implementiert)

### Video ruckelt beim Loop
**Lösung:** 
1. Stelle sicher, dass das Video als seamless loop exportiert wurde
2. Erste und letzte Frame müssen identisch sein

### Video zu dunkel/hell
**Lösung:** Passe `overlayOpacity` an:
```tsx
{/* Heller */}
<BackgroundVideo overlayOpacity={0.2} />

{/* Dunkler */}
<BackgroundVideo overlayOpacity={0.6} />
```

### Text nicht lesbar
**Lösung:** Kombiniere mehrere Techniken:
```tsx
<BackgroundVideo overlayOpacity={0.5} />
<div className="bg-black/40 backdrop-blur-sm">
  <h1 className="text-white drop-shadow-lg">Text</h1>
</div>
```

## 🎬 Weitere Optimierungen (optional)

### WebM Version erstellen
Für noch bessere Kompression kannst du zusätzlich WebM-Versionen erstellen:

```tsx
<video>
  <source src="path/to/video.webm" type="video/webm" />
  <source src="path/to/video.mp4" type="video/mp4" />
</video>
```

**Export-Settings in Handbrake:**
- Format: WebM (VP9)
- Quality: CRF 30-35
- Ergebnis: ~30-40% kleinere Dateien

### Intersection Observer (Lazy Load)
Falls das Video nicht sofort sichtbar ist:

```tsx
const [shouldLoad, setShouldLoad] = useState(false)

useEffect(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      setShouldLoad(true)
    }
  })
  
  observer.observe(ref.current)
  return () => observer.disconnect()
}, [])

{shouldLoad && <BackgroundVideo />}
```

## 📝 Beispiel: Komplette Landing Page

```tsx
import { BackgroundVideo } from "@/components/background-video"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Background Video */}
      <BackgroundVideo 
        overlayOpacity={0.4}
        posterImage="/images/ocean-poster.webp"
      />
      
      {/* Content */}
      <main className="relative z-10">
        {/* Hero */}
        <section className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-6 px-4">
            <h1 
              className="text-5xl md:text-7xl font-bold text-white"
              style={{ textShadow: '0 4px 20px rgba(0,0,0,0.7)' }}
            >
              Ozean Licht
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto bg-black/30 backdrop-blur-sm p-6 rounded-lg">
              Deine Metaphysik Akademie für Advanced Transformation
            </p>
            
            <button className="bg-primary text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-primary/90 transition-colors shadow-2xl">
              Jetzt starten
            </button>
          </div>
        </section>
        
        {/* Weitere Sections mit solidem Background */}
        <section className="bg-background py-20">
          {/* Content */}
        </section>
      </main>
    </div>
  )
}
```

---

**Made with 🌊 for Ozean Licht Metaphysik Akademie**

