#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Alle fehlenden Kurse mit Subtitles und Tags
const remainingCourseUpdates = {
  // === CHANNELING EVENTS (LCQ) ===
  "gruppen-channeling-event-lions-gate-vom-08-08-2024": {
    subtitle: "Lions Gate 2024 Portal - Kraftvolle Transformation für Selbsterkenntnis und Wachstum",
    tags: ["LCQ"]
  },
  "equinox-gruppen-channeling-event-vom-20-03-2025": {
    subtitle: "Frühjahrs Tag-und-Nacht-Gleiche - Balance und Neuausrichtung deiner Energien",
    tags: ["LCQ"]
  },
  "equinox-gruppen-channeling-event-vom-22-09-2024": {
    subtitle: "Herbst Equinox - Harmonisierung und Vorbereitung auf die dunkle Jahreszeit",
    tags: ["LCQ"]
  },
  "lcq-und-channeling-quer-durch-die-zeitmatrix": {
    subtitle: "Reise durch die Zeitmatrix - Heilung paraleller Inkarnationen und Timeline-Integration",
    tags: ["LCQ"]
  },
  "no-limits-lcq-mental-decoding-mit-andromeda-und-den-fairy-kollektiv": {
    subtitle: "Mental DeCoding mit Andromeda - Befreie dich von limitierenden Glaubensmustern",
    tags: ["LCQ"]
  },
  "planetare-aufreihung-vom-25-01-2025": {
    subtitle: "Planetare Ausrichtung - Nutze kosmische Energien für deine Transformation",
    tags: ["LCQ"]
  },
  "gruppen-channeling-event-am-11-11-2025": {
    subtitle: "11:11 Portal - Manifestation und Bewusstseinserweiterung am mystischen Datum",
    tags: ["LCQ"]
  },
  "gruppen-channeling-event-am-21-10-2025": {
    subtitle: "Herbst Channeling - Tiefe Energiearbeit für innere Transformation",
    tags: ["LCQ"]
  },
  "gruppen-channeling-event-am-21-12-2025": {
    subtitle: "Wintersonnenwende 2025 - Licht in der Dunkelheit und Jahresabschluss-Ritual",
    tags: ["LCQ"]
  },
  
  // === WORKSHOPS & KURSE ===
  "timelineshift-kurs": {
    subtitle: "Wähle deine Timeline bewusst - Meistere die Kunst der Realitätskreierung im Quantum",
    tags: ["Aufbau"]
  },
  "intensives-chakra-clearing": {
    subtitle: "Tiefenreinigung deiner Energiezentren - Befreie blockierte Chakren für mehr Vitalität",
    tags: ["Aufbau"]
  },
  "open-heart-code": {
    subtitle: "Öffne dein Herz für bedingungslose Liebe - Aktiviere dein Herzchakra vollständig",
    tags: ["Aufbau"]
  },
  "projekt-kontakt": {
    subtitle: "Bereite dich vor auf bewussten ET-Kontakt - Grundlagen der extraterrestrischen Kommunikation",
    tags: ["Basis"]
  },
  "metaphysics-of-souls": {
    subtitle: "Die Metaphysik der Seele - Verstehe die tieferen Gesetze deiner Seelenexistenz",
    tags: ["Fortgeschritten"]
  },
  
  // === FÜLLE KURSE ===
  "fuelle-klinik-1-0": {
    subtitle: "Öffne dich für Fülle - Löse Mangelbewusstsein und aktiviere deinen Wohlstandsflow",
    tags: ["Basis"]
  },
  "fuelle-klinik-2-0": {
    subtitle: "Vertiefe deine Fülle - Advanced Techniken für nachhaltigen Wohlstand und Abundanz",
    tags: ["Aufbau"]
  },
  
  // === Q&A EVENTS ===
  "qa-event-aufzeichnung-vom-31-07-2024": {
    subtitle: "Deine Fragen beantwortet - Q&A zu Metaphysik, ET-Kontakt und spirituellem Wachstum",
    tags: ["Q&A"]
  },
  "qa-aufzeichnung-vom-25-02-2024": {
    subtitle: "Frage & Antwort Session - Tiefe Einblicke in aktuelle Themen und Transformationsprozesse",
    tags: ["Q&A"]
  },
  "neue-energien-qa-event-vom-16-06-2024": {
    subtitle: "Neue Energien verstehen - Q&A zu den aktuellen Bewusstseinsveränderungen auf der Erde",
    tags: ["Q&A"]
  },
  "qa-arcturian-channeling": {
    subtitle: "Fragen an den Rat von Arcturus - Kosmische Weisheit für deinen Weg",
    tags: ["Q&A", "Kostenlos"]
  },
  "qa-sassani-channeling": {
    subtitle: "Sassani Kollektiv channeln - Frage & Antwort mit den freundlichen ETs",
    tags: ["Q&A", "Kostenlos"]
  },
  "qa-zu-meinem-leben-mit-extraterrestrischen": {
    subtitle: "Leben mit ETs - Persönliche Erfahrungen und Antworten zu galaktischen Kontakten",
    tags: ["Q&A"]
  },
  
  // === INTERVIEWS ===
  "lia-lohmanns-interview-aus-dem-online-kongress-der-neue-mensch": {
    subtitle: "Online Kongress Interview - Der neue Mensch und die Transformation der Erde",
    tags: ["Interview", "Kostenlos"]
  },
  "lia-lohmanns-interview-beim-starseed-summit": {
    subtitle: "Starseed Summit Interview - Aktivierung und Mission der Sternensaaten",
    tags: ["Interview"]
  },
  "lia-lohmanns-interview-auf-dem-online-kongress-aliens-welcome": {
    subtitle: "Aliens Welcome Kongress - Offenheit für außerirdisches Leben und Kontakt",
    tags: ["Interview", "Kostenlos"]
  },
  "lia-lohmanns-interview-auf-dem-online-kongress-gregor-stark": {
    subtitle: "Gregor Stark Kongress Interview - Metaphysik und galaktisches Bewusstsein",
    tags: ["Interview", "Kostenlos"]
  },
  "interview-unsterblichkeitskongress-veranstaltet-von-andreas-kolos": {
    subtitle: "Unsterblichkeitskongress Interview - Bewusstsein jenseits des physischen Todes",
    tags: ["Interview", "Kostenlos"]
  },
  "herzensmensch-kongress": {
    subtitle: "Herzensmensch Kongress - Leben aus dem Herzen und authentische Verbindung",
    tags: ["Interview", "Kostenlos"]
  },
  "podcast-interview-mit-natalie-zieger-die-matrix-erklaert": {
    subtitle: "Die Matrix erklärt - Podcast Interview über Realitätsstrukturen und Bewusstsein",
    tags: ["Interview", "Kostenlos"]
  },
  "podcast-interview-mit-martin-schumacher-extraterrestrisches-wissen": {
    subtitle: "Podcast: Extraterrestrisches Wissen - Kosmische Weisheit für die neue Zeit",
    tags: ["Interview", "Kostenlos"]
  },
  "lia-mein-leben-als-hybrid-und-botschafterin-interview-mit-raik-garve-yt": {
    subtitle: "Interview mit Raik Garve - Leben als plejadischer Hybrid und galaktische Botschafterin",
    tags: ["Interview", "Kostenlos"]
  },
  "metaphysik-des-bewusstseins-interview-mit-raik-garve-yt": {
    subtitle: "Metaphysik des Bewusstseins - Interview über die tieferen Gesetze der Realität",
    tags: ["Interview", "Kostenlos"]
  },
  "feinstoffliche-energien-nicht-physischer-wesen-interview-mit-raik-garve-yt": {
    subtitle: "Interview: Feinstoffliche Energien - Nicht-physische Wesen und ihre Einflüsse",
    tags: ["Interview", "Kostenlos"]
  },
  "qa-mit-lia-lohmann-raik-garve-yt": {
    subtitle: "Q&A mit Raik Garve - Spirituelle Themen aus metaphysischer Perspektive",
    tags: ["Q&A", "Interview", "Kostenlos"]
  },
  
  // === SPECIAL DEALS ===
  "partner-friends-special-deal": {
    subtitle: "Exklusives Partner & Friends Angebot - Zugang zu ausgewählten Premium-Kursen",
    tags: ["Kostenlos"]
  }
};

async function updateRemainingCourses() {
  console.log('\n=== UPDATING REMAINING COURSES ===\n');
  
  let successCount = 0;
  let errorCount = 0;
  let notFoundCount = 0;
  
  for (const [slug, updates] of Object.entries(remainingCourseUpdates)) {
    try {
      const { data, error } = await supabase
        .from('courses')
        .update({
          subtitle: updates.subtitle,
          tags: updates.tags
        })
        .eq('slug', slug)
        .select('id, title, subtitle, tags');
      
      if (error) {
        console.error(`❌ Error updating ${slug}:`, error.message);
        errorCount++;
      } else if (data && data.length > 0) {
        console.log(`✅ ${data[0].title}`);
        console.log(`   Subtitle: ${updates.subtitle}`);
        console.log(`   Tags: ${updates.tags.join(', ')}`);
        console.log('');
        successCount++;
      } else {
        console.log(`⚠️  Course not found: ${slug}`);
        notFoundCount++;
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (err) {
      console.error(`❌ Fatal error updating ${slug}:`, err.message);
      errorCount++;
    }
  }
  
  console.log('\n=== SUMMARY ===');
  console.log(`✅ Successfully updated: ${successCount}`);
  console.log(`⚠️  Not found: ${notFoundCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📊 Total processed: ${Object.keys(remainingCourseUpdates).length}`);
}

updateRemainingCourses();

