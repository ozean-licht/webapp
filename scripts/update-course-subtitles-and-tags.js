#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Mapping von Kurs zu Subtitle und Tags
const courseUpdates = {
  // === BASISKURSE ===
  "vibehigh-masterclass": {
    subtitle: "Erhöhe deine Frequenz und halte sie hoch - für ein positives, glückliches Leben voller Leichtigkeit",
    tags: ["Basis"]
  },
  "self-love": {
    subtitle: "Deine Reise zu bedingungsloser Selbstliebe - Auflösung von Hypnosecodes für ein erfülltes Leben",
    tags: ["Basis"]
  },
  
  // === AUFBAU ===
  "timeline-shift-kurs": {
    subtitle: "Wähle deine Timeline bewusst - Meistere die Kunst der Realitätskreierung im Quantum",
    tags: ["Aufbau"]
  },
  "energy-transform": {
    subtitle: "Beende den Clearing-Zyklus - Gehe an die Ursache von Energieblockaden und finde wahre Balance",
    tags: ["Aufbau"]
  },
  "shadow-transform": {
    subtitle: "Integriere deine Schatten in deine Göttlichkeit - Der Weg zu wahrer Meisterschaft",
    tags: ["Aufbau"]
  },
  
  // === FORTGESCHRITTEN ===
  "channeling-akademie-aufzeichnungen": {
    subtitle: "Werde ein klarer Kanal für höherdimensionale Energien - Von den Grundlagen zur Meisterschaft",
    tags: ["Fortgeschritten"]
  },
  "starseed-aktivierungs-kurs": {
    subtitle: "Vollständiges Erwachen für Starseeds - Aktiviere dein Bewusstsein und deine Mission",
    tags: ["Fortgeschritten"]
  },
  
  // === MASTER LEVEL ===
  "quantum-master-prepare": {
    subtitle: "Intensive Vorbereitung auf die Quantum Meisterschaft - Dein Fundament für die 5D",
    tags: ["Master"]
  },
  "quantum-masterkurs": {
    subtitle: "Aktiviere deine Quantum-Superkräfte - Channeling, Manifestation & 5D-Bewusstsein",
    tags: ["Master"]
  },
  "athemirah-cosmic-school-jahr-1": {
    subtitle: "Zeitlose Weisheit der Meister - Deine Reise durch die Dimensionen mit St. Germain, Merlin & mehr",
    tags: ["Master"]
  },
  "athemirah-cosmic-school-jahr-2": {
    subtitle: "Werde zum Meister dieser Zeit - Advanced Alchemie & Metaphysik mit kosmischen Lehrern",
    tags: ["Master"]
  },
  
  // === ADVANCED / INTENSIV ===
  "earth-code": {
    subtitle: "Durchschaue die künstliche Erdmatrix - Für mutige Seelen mit stabiler psychischer Verfassung",
    tags: ["Fortgeschritten", "Intensiv"]
  },
  "energy-code-basic": {
    subtitle: "Meistere dein Energiefeld - Grundlagen der energetischen Selbstmeisterung für Hochsensitive",
    tags: ["Fortgeschritten"]
  },
  
  // === KOSTENLOSE KURSE ===
  "arcturian-light-kurs-unser-geschenk-fuer-dich": {
    subtitle: "Unser Geschenk an dich - Direkter Kontakt mit dem Rat von Arcturus",
    tags: ["Kostenlos", "Basis"]
  },
  "emotionale-heilung-interview-aus-dem-kongress-transformer-symposium-earth": {
    subtitle: "Schweizer Kongress Interview - Erkenntnisse zur emotionalen Heilung",
    tags: ["Kostenlos", "Interview"]
  },
  "seelenfamilien-und-dna-aktivierung-interview-yt": {
    subtitle: "Interview mit Christiane - Seelenfamilien und DNA Aktivierung",
    tags: ["Kostenlos", "Interview"]
  },
  "transhumanismus-potentielle-zeitlinien-der-erde-interview-mit-raik-garve-yt": {
    subtitle: "Interview mit Raik Garve - Transhumanismus und potentielle Zeitlinien der Erde",
    tags: ["Kostenlos", "Interview"]
  },
  
  // === LCQ & CHANNELING EVENTS ===
  "lions-gate-gruppen-channeling-event-vom-08-08-2024": {
    subtitle: "Kraftvolles Portal für Transformation - Light Code Transmission mit kosmischen Energien",
    tags: ["LCQ"]
  },
  "sirian-gateway-gruppen-channeling-event-vom-24-07-2024": {
    subtitle: "Sirius Energien für Selbsterkenntnis - Vorbereitung auf das Lions Gate Portal",
    tags: ["LCQ"]
  },
  "sirian-gateway-gruppen-channeling-event-am-28-07-2025": {
    subtitle: "Quantenfeld neu kalibrieren - Dekodierung alter Programme mit Herzportal-Aktivierung",
    tags: ["LCQ"]
  },
  "solstice-gruppen-channeling-event-am-21-06-2025": {
    subtitle: "Sommersonnenwende Magie - Kristalline Seelenaktivierung im Avalon Garten",
    tags: ["LCQ"]
  },
  "solstice-gruppen-channeling-event-vom-21-12-2024": {
    subtitle: "Wintersonnenwende Transformation - Blutreinigung, Ahnenlinien-Heilung & Quantentechnologie",
    tags: ["LCQ"]
  },
  "equinox-gruppen-channeling-event-am-22-09-2025": {
    subtitle: "Harmonisierung der Seelenarchitektur - Befreiung von der limitierenden Lunar Matrix",
    tags: ["LCQ"]
  },
  "equinox-gruppen-channeling-vom-20-03-2025": {
    subtitle: "Frühjahrs-Tag-und-Nacht-Gleiche - Tiefe energetische Neuausrichtung",
    tags: ["LCQ"]
  },
  "transcend-gruppen-channeling-event-vom-31-12-2024": {
    subtitle: "Jahreswechsel Neuanfang - Lemurische Energien & Fairy Kollektiv für 2025",
    tags: ["LCQ"]
  },
  "energiefeld-clearing-lcq-channeling": {
    subtitle: "Aura Clearing & Kristalline Grids - Rückverbindung mit den Informationen von Gaia",
    tags: ["LCQ"]
  },
  "energie-update-upgrade-fuer-das-jahr-lcq": {
    subtitle: "Jahres-Energie Upgrade - Metaphysisches Wissen mit St. Germain & Arcturus",
    tags: ["LCQ"]
  },
  "zeitlinien-shift-lcq-beende-deinen-inneren-kampf-und-leiden": {
    subtitle: "Beende inneren Kampf - Zeitlinien shiften für ein 5D Bewusstsein",
    tags: ["LCQ"]
  },
  "lions-gate-gruppen-channeling-event-am-08-08-2025": {
    subtitle: "Lions Gate Portal 2025 - Potente Transformation für dein höchstes Potenzial",
    tags: ["LCQ"]
  },
  
  // === WORKSHOPS & Q&A ===
  "astral-angriff-schutz-workshop": {
    subtitle: "Schütze dich vor Astral-Angriffen - Praktische Werkzeuge für deine energetische Sicherheit",
    tags: ["Q&A", "Aufbau"]
  },
  "sterben-fuer-anfaenger": {
    subtitle: "Das Ende ist der Anfang - Löse Ängste und entdecke die Schönheit des Sterbens",
    tags: ["Q&A", "Aufbau"]
  },
  "workshop-mit-qa-teil-aktuelle-ufo-sichtungen-uap-enthuellungen-und-ereignisse-zum-jahresende-2024": {
    subtitle: "UFO/UAP Enthüllungen erklärt - Galaktische Föderation, Disclosure & die Wahrheit hinter den Medien",
    tags: ["Q&A", "Fortgeschritten"]
  },
  
  // === SPEZIAL KURSE ===
  "fulle-klinik-1-0": {
    subtitle: "Öffne dich für Fülle - Löse Mangelbewusstsein und aktiviere deinen Wohlstandsflow",
    tags: ["Basis"]
  },
  "fulle-klinik-2-0": {
    subtitle: "Vertiefe deine Fülle - Advanced Techniken für nachhaltigen Wohlstand",
    tags: ["Aufbau"]
  },
  "in-my-higher-selfs": {
    subtitle: "Lebe als dein höheres Selbst - Integration deiner 5D Version im Alltag",
    tags: ["Fortgeschritten"]
  }
};

async function updateCoursesSubtitlesAndTags() {
  console.log('\n=== UPDATING COURSE SUBTITLES AND TAGS ===\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const [slug, updates] of Object.entries(courseUpdates)) {
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
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📊 Total processed: ${Object.keys(courseUpdates).length}`);
}

updateCoursesSubtitlesAndTags();

