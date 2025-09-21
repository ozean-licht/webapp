"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PrimaryButton } from "@/components/primary-button"
import { SpanBadge } from "@/components/span-badge"
import { SpanDesign } from "@/components/span-design"
import { InfoCard } from "@/components/info-card"
import { KidsAscensionPromo } from "@/components/kids-ascension-promo"
import { PartnerDealPromo } from "@/components/partner-deal-promo"
import { CTA2 } from "@/components/cta-2"
import { FaqItem } from "@/components/faq-item"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Megaphone, Heart, Users, Baby, Lightbulb, Calendar } from "lucide-react"

export default function LoveLetterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    topic: "",
    title: "",
    content: "",
    bio: "",
    agreeTerms: false,
    agreePrivacy: false
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <Header />

      <main className="space-y-20">
        {/* Hero Section */}
        <section className="w-full py-16 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <SpanDesign>Eine Stimme der Gemeinschaft</SpanDesign>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-cinzel text-white text-balance">
              Love Letter
            </h1>

            <p className="text-white/70 font-montserrat-alt text-lg max-w-3xl mx-auto">
              Willkommen in unserem Raum der Co-Kreation. Der Love Letter ist mehr als nur ein Newsletter – er ist ein lebendiger Ausdruck unserer Community. In regelmäßigen Abständen erschaffen wir gemeinsam eine Sammlung inspirierender Beiträge, die unsere kollektive Weisheit und Erfahrung widerspiegeln.
            </p>

            {/* Centered Cover */}
            <div className="flex justify-center">
              <div className="p-2 rounded-xl border border-border max-w-2xl" style={{ backgroundColor: "#00151A" }}>
                <img
                  src="https://suwevnhwtmcazjugfmps.supabase.co/storage/v1/object/public/assets/love-letter-promo.webp"
                  alt="Love Letter Promo"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>

            {/* Horizontal SpanBadges */}
            <div className="flex flex-wrap justify-center gap-3">
              <SpanBadge icon="moon" text="Alle 3 Monde" />
              <SpanBadge icon="star" text="Community Beiträge" />
              <SpanBadge icon="heart" text="Love to Go" />
              <SpanBadge icon="magicwand" text="Kosmische Impulse" />
            </div>

            {/* Button that scrolls to form */}
            <div className="pt-4">
              <a href="#contribution-form">
                <PrimaryButton>Beitrag einreichen →</PrimaryButton>
              </a>
            </div>
          </div>
        </section>

        {/* What is Love Letter Section */}
        <section className="w-full py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-cinzel text-white">Was erreicht dich im Love Letter?</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <InfoCard
                heading="Updates & Announcements"
                paragraph="Sei stets auf dem neuesten Stand über alle Entwicklungen und Neuigkeiten in der Ozean Licht-Welt. Erfahre von neuen Angeboten und Möglichkeiten zur persönlichen Entfaltung."
                icon={<Megaphone size={24} />}
              />

              <InfoCard
                heading="Beiträge von Lia"
                paragraph="Tauche ein in tiefgründige Erkenntnisse, persönliche Reflexionen und kraftvolle Einsichten von Lia, die dein Herz berühren und deinen Geist erhellen werden."
                icon={<Heart size={24} />}
              />

              <InfoCard
                heading="Community Beiträge"
                paragraph="Die Weisheit unserer Gemeinschaft ist ein kostbarer Schatz. Hier teilen Gleichgesinnte ihre Erkenntnisse aus Wissenschaft, Spiritualität und Psychologie – authentisch, herzöffnend und transformativ."
                icon={<Users size={24} />}
              />

              <InfoCard
                heading="Kids Ascension Updates"
                paragraph="Speziell für Eltern und alle, die mit der neuen Generation arbeiten: Erfahre, wie du Kinder auf ihrem einzigartigen Weg des Erwachens liebevoll begleiten kannst."
                icon={<Baby size={24} />}
              />

              <InfoCard
                heading="Inspirationen"
                paragraph="Lass dich von zarten Gedankenimpulsen, meditativen Texten und praktischen Übungen inspirieren, die dich im Alltag unterstützen und dein inneres Licht zum Strahlen bringen."
                icon={<Lightbulb size={24} />}
              />

              <InfoCard
                heading="Event-Kalender & Kursvorschau"
                paragraph="Entdecke kommende Veranstaltungen, Workshops und Kurse, die deine persönliche Entwicklung fördern und dich mit unserer wachsenden Gemeinschaft verbinden."
                icon={<Calendar size={24} />}
              />
            </div>
          </div>
        </section>

        {/* Contribution Topics Section */}
        <section className="w-full py-16 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-cinzel text-white">Dein Beitrag kann diese Bereiche berühren</h2>

            {/* FAQ Style for Topics */}
            <div className="space-y-4 max-w-2xl mx-auto">
              <FaqItem
                question="Wissenschaftliche Erkenntnisse"
                answer="Teile deine wissenschaftlichen Entdeckungen und Erkenntnisse, die das Bewusstsein erweitern."
              />

              <FaqItem
                question="Spirituelle Einsichten"
                answer="Deine spirituellen Erfahrungen und tiefen Einsichten, die andere bereichern können."
              />

              <FaqItem
                question="Innovative Projekte"
                answer="Erzähle von deinen kreativen Projekten und Initiativen, die einen Unterschied machen."
              />

              <FaqItem
                question="Psychologische Betrachtungen"
                answer="Deine psychologischen Erkenntnisse und Betrachtungen über menschliches Verhalten und Bewusstsein."
              />

              <FaqItem
                question="Persönliche Realisierungen"
                answer="Deine persönlichen Durchbrüche und Realisierungen auf dem Weg der persönlichen Entwicklung."
              />

              <FaqItem
                question="Berührende Geschichten"
                answer="Authentische Geschichten, die Herzen berühren und Hoffnung schenken."
              />

              <FaqItem
                question="Portraitierung inspirierender Persönlichkeiten"
                answer="Erzählungen über Menschen, die dich inspirieren und die Welt positiv beeinflussen."
              />
            </div>
          </div>
        </section>

        {/* Contribution Form Section */}
        <section id="contribution-form" className="w-full py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <SpanDesign>Beitrag Einreichen</SpanDesign>
              <h2 className="text-3xl md:text-4xl font-cinzel text-white mt-8 mb-4">Deinen Beitrag Senden</h2>
              <p className="text-white/70 font-montserrat-alt text-lg">
                Wir laden dich herzlich ein, jederzeit deinen persönlichen Beitrag für unseren Love Letter einzureichen.
                Aus allen Einsendungen wählen wir achtsam jene aus, die den Geist unseres Love Letters am besten verkörpern.
              </p>
            </div>

            {/* Form Wrapper */}
            <div className="rounded-xl border bg-[#00151a] p-8" style={{ borderColor: "#052a2a" }}>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-white font-montserrat-alt">Vorname *</label>
                    <Input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      required
                      className="bg-[#001212]"
                      style={{ borderColor: "#052a2a" }}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-white font-montserrat-alt">Nachname *</label>
                    <Input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      required
                      className="bg-[#001212]"
                      style={{ borderColor: "#052a2a" }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-white font-montserrat-alt">Email *</label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="bg-[#001212]"
                    style={{ borderColor: "#052a2a" }}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="topic" className="text-white font-montserrat-alt">Themenbereich *</label>
                  <Select value={formData.topic} onValueChange={(value) => handleInputChange("topic", value)}>
                    <SelectTrigger className="bg-[#001212]" style={{ borderColor: "#052a2a" }}>
                      <SelectValue placeholder="Wähle aus.." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="science">Wissenschaftliche Erkenntnisse</SelectItem>
                      <SelectItem value="spiritual">Spirituelle Einsichten</SelectItem>
                      <SelectItem value="projects">Innovative Projekte</SelectItem>
                      <SelectItem value="psychology">Psychologische Betrachtungen</SelectItem>
                      <SelectItem value="personal">Persönliche Realisierungen</SelectItem>
                      <SelectItem value="stories">Berührende Geschichten</SelectItem>
                      <SelectItem value="portraits">Portraitierung inspirierender Persönlichkeiten</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="title" className="text-white font-montserrat-alt">Titel deines Beitrags *</label>
                  <Input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                    className="bg-[#001212]"
                    style={{ borderColor: "#052a2a" }}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="content" className="text-white font-montserrat-alt">Dein Beitrag *</label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange("content", e.target.value)}
                    required
                    rows={8}
                    placeholder="Teile deine Erkenntnisse, Geschichten oder Inspirationen..."
                    className="bg-[#001212]"
                    style={{ borderColor: "#052a2a" }}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="bio" className="text-white font-montserrat-alt">Kurze Beschreibung über dich</label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    rows={3}
                    placeholder="Optional: Erzähl uns kurz etwas über dich..."
                    className="bg-[#001212]"
                    style={{ borderColor: "#052a2a" }}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agreeTerms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => handleInputChange("agreeTerms", checked as boolean)}
                    />
                    <label htmlFor="agreeTerms" className="text-white/70 font-montserrat-alt text-sm">
                      *Ich stimme zu, dass mein Beitrag und die angegebenen Informationen im Ozean Licht Love Letter
                      und auf der Website veröffentlicht werden dürfen.
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agreePrivacy"
                      checked={formData.agreePrivacy}
                      onCheckedChange={(checked) => handleInputChange("agreePrivacy", checked as boolean)}
                    />
                    <label htmlFor="agreePrivacy" className="text-white/70 font-montserrat-alt text-sm">
                      *Ich habe die Datenschutzerklärung gelesen und erkläre mich damit einverstanden.
                    </label>
                  </div>
                </div>

                <div className="pt-6 text-center">
                  <PrimaryButton type="submit">Beitrag einreichen →</PrimaryButton>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Kids Ascension Promo */}
        <KidsAscensionPromo />

        {/* Partner Deal Promo */}
        <PartnerDealPromo />

        {/* CTA 2 */}
        <CTA2 />
      </main>

      <Footer />
    </div>
  )
}
